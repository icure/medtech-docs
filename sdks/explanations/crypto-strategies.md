---
slug: crypto-strategies
tags:
 - crypto
 - keys
---
# Crypto Strategies

iCure uses end-to-end encryption to ensure that the data created by your application is accessible only to the intended
recipients.
Even if a malicious actor gets access to iCure's databases all the data they retrieve will have very little value, since
they will not be able to decrypt unless they also gain access to the private keys of your users.

The iCure SDK handles automatically encryption of your data for the most part, however, there are some aspects of
encryption that can be handled optimally only with input from your application.
This is where the Crypto Strategies come into play: by providing your own implementation of the `CryptoStrategies`
interface you can customise the behaviour of iCure to improve the security and accessibility of your data.

By creating your own implementation of the crypto strategies you will be able to:
- configure which user types will be kept anonymous in sharing metadata ([anonymous data sharing](#anonymous-data-sharing))
- implement your own key recovery and verification mechanisms ([key recovery and verification](#key-recovery-and-verification))
- reduce the trust you put on the iCure server when recovering the key pairs of other users for data encryption  ([server trust](#server-trust))
- configure the key pair generation strategy ([key pair generation](#key-pair-generation))

## Anonymous data sharing

When a user shares an entity with another user the iCure SDK will create some "sharing metadata" which is essential for:
- decryption of the entity on the client side.
- access control on the server side.

In iCure we call this kind of metadata a delegation and each delegation is from a *delegator* (the user sharing the
data) to a *delegate* (the user gaining access to the data through the delegation).
Both delegator and delegate are data owners in your application (e.g. patients or {{hcps}}), and either of them can be
*explicit* or *anonymous*. You can configure which data owners will be anonymous or explicit by implementing the
`dataOwnerRequiresAnonymousDelegation` method in the `CryptoStrategies`.

:::info

If you are using the "Simple" crypto strategies implementation, by default only patients will be *anonymous* data
owners, while {{hcps}}{{#medtech}} and devices {{/medtech}} will be *explicit* data owners.

:::

The most visible difference between explicit and pseudo-anonymised data owners is that explicit data owners have their id stored
in clear in the sharing metadata, while the id of pseudo-anonymised data owner does not appear in clear in any metadata.

:::info

Additionally, the *explicit* or *anonymous* nature of a data owner will change the default values of the `author` and
`responsible` fields of the entities created by the data owner.

When a data owner creates an entity the iCure SDK will automatically fill the values for author and responsible. For
explicit data owners these will be the user and data owner id of the creator, respectively, while for anonymous data
owners these will be `*`.

:::

### Why is it necessary?

In iCure the link between medical data and the patient it refers to is encrypted.
However, if you treat patients as explicit data owners, you risk leaking this link: this is because in most applications
it is safe to assume that if a piece of data is shared with a patient then the data refers to that patient (or at the
very least to a close relative).
Therefore, having delegation with the patient id in clear in an entity is equivalent to having a cleartext `refersTo`
link in the medical data.


But why do we need to hide the link between medical data and patients, if the medical data itself is encrypted?

The reason is that actually you can't encrypt all data in iCure: while most details of medical data are encrypted, your
application may need to use tags or codes to organise data. If you want to search for data having some specific tag/code,
then these values need to be readable by the iCure server, and therefore they must be unencrypted.


Therefore, depending on the kind of tags/codes you use in your application, having a clear link between medical data and
patient could be detrimental to the privacy of your users.

{{#medtech}}
For example, suppose you are developing a medical device that reads various vital sign of your users, analyzes them and
then determines the chances of the user suffering a certain health issue in the future. In this case the vitals reading
will be encrypted, but maybe you want to be able to easily find the users with high risk, so you add a code with the
risk class to the entity.
{{/medtech}}
{{#ehrlite}}
For example, suppose you are developing an EHR application, and you want to be able to group the observations/condition
by the kind of disease that was identified. For this purpose you add SNOMED CT codes such as blood disease (414022008)
or hearth disease (56265001) to the entities' codes. In this case the details of the observations/conditions will be
encrypted, but the SNOMED CT codes will be stored in clear.
{{/ehrlite}}

The unencrypted tags in the {{#medtech}}data samples{{/medtech}}{{#ehrlite}}observations/conditions{{/ehrlite}} give
away some limited, but still sensitive information about the patient, and therefore you should be careful to not leak
the link between the patient and the data.

:::note

This does not mean that if you don't use pseudo-anonymised data owners then anyone will be able to infer some information about
your users from the tags and the sharing metadata, since the iCure server will still enforce access control.

:::

In conclusion the pseudo-anonymised data owners serve two main purposes:
- Provide an extra layer of protection in case of unauthorized access to the database.
- Allow you to safely share medical data with the patients and with other data owners that should not be allowed to
identify the patients that the data refers to (e.g. for the purpose of clinical research).
<!-- TODO: we need to allow in the simplified SDKs to share only entity without link -->

### Why not always use pseudo-anonymised data owners? - The cost of anonymity

Anonymous data sharing is great for the privacy of your users, but it comes at a cost, especially when it comes to
access control.

Access control for *explicit* data owners is straightforward: is there a delegation for you? If yes, then you have
access, otherwise you don't.

For *anonymous* data owners, the access control is more complex, since in order to protect the data owners'
privacy the iCure server can't know or decrypt in any way the ids of *anonymous* data owners with access to the entity.
The solution we use in iCure consists in using a special password in the delegation that only the delegator or
delegate of the delegation know. We call this password an *access control key* (AC key).

:::info

The AC keys are 16 bytes long, and are derived from a secret randomly generated by the iCure SDK and a constant that
depends on the type of entity they are used in.

Since these keys are not related to the encryption keys used to encrypt the data, they can be safely shared with the
iCure server.

:::

The issue with this approach is that since each AC key can only be known by a specific delegator and delegate pair, we
have a key for each possible pair (although only pairs were at least one of the two is a pseudo-anonymised data owner will
actually be used).

Additionally, a user can't know in advance which AC key he should use to retrieve (or search for) an entity, therefore
pseudo-anonymised data owners will have to send ALL their keys for each request that uses delegation-based access control. For
this purpose the SDK will keep a cache of all the AC keys of the user.

:::note

The cache of AC keys is created automatically on instantiation of the SDK, and is NOT updated automatically.

If another data owner shares data with the user for the first time the user will not be allowed to access the data until
this cache is refreshed through the `cryptoApi.forceReload` method.

:::

The amount of AC keys that a pseudo-anonymised data owner will use is proportional to the number of data owners involved in a
sharing relationship with him (as delegator or as delegate, regardless of the explicit/anonymous nature of the other
data owner).
Additionally, this number is also proportional to the number of key pairs that the data owner has: if the data owner
loses key pairs and creates new one he will have to create new AC keys. As a security measure this is the case even if
the data owner has regained access to his old data through the give-access-back mechanism.

Although there is no theoretical limit to the number of AC keys that a user can have, there is a practical limit due to
the need for a cache of all AC keys on the client side and having to send all the keys on most requests.
For this reason patients are usually good candidate for pseudo-anonymised data owners, since they are usually going to share
data with at most ~10 other data owners and virtually never with more than 100.
On the contrary in some applications HCP users will have to share data with thousands or even tens of thousands of other
users (e.g. a general practitioner sharing prescriptions directly with the patient), and therefore they are not good
candidates for pseudo-anonymised data owners.

:::note

Since the amount of AC keys is also proportional to the number of key pairs of data owners, you should avoid creating
new key-pairs and instead try to recover the old ones whenever possible.

You can learn more about key recovery in the [key recovery and verification](#key-recovery-and-verification) section.

:::

### Implementation recommendations

- Our recommendation is to have {{hcps}} as explicit data owners and patients as pseudo-anonymised data owners. {{#medtech}}For
  medical devices it depends on your application: if a device is associated only a few patients (i.e. it is easy to draw
  a connection from a device to a patient) it should be anonymous; on the contrary, if the device can't be easily
  associated to patients it should be explicit. {{/medtech}}
- The implementation of the `dataOwnerRequiresAnonymousDelegation` method must be consistent across all instances of
  your application, otherwise data owners may not be able to access all their data. This must be the case also if you
  offer different types of applications for {{hcps}} and patients that use the same database.
- Changing the *explicit* or *anonymous* nature of data owners would require to change all the data of the affected data
  owners, and particularly in case of migration from *anonymous* to *explicit* data owners also access to the key-pairs
  of said data owners. This operation is not officially supported by the iCure SDK, therefore, you should carefully
  which data owners should be *anonymous* and which should be *explicit* before releasing your application.

<!-- TODO Link between anonymous patient and explicit hcp is not encrypted. Usually this is not a problem, but in case
of a clinic with different types of specialists it could be. Solution: general "receptionist" creating the patient and
sharing with the organisation. Do we need to add some more details about this? -->

## Key Recovery and Verification

End-to-end encryption is great to protect the data of your users from unauthorised access, but it also means that if
your users lose their private keys they will lose access to their data as well!

The iCure SDK provides some data and key recovery mechanisms, but it would always be better if you also provide a
custom recovery method that fits your application.
For example, you could allow your users to save their private key in a file, encrypted by a custom password.

In order to use custom key recovery in your application you will have to implement the methods `notifyKeyPairGeneration`
and `recoverAndVerifyKeys` of the crypto strategies interface.
When the SDK determines that a new key pair should be generated it will call the `notifyKeyPairGeneration` method of
the crypto strategies, allowing you to prompt the user to save the key for future recovery.
When instead the SDK realises that a key pair for the logged data owner is not available on the device it will call the
`recoverAndVerifyKeys`, which allows you to prompt the user to load the key he saved in the past.

## Server trust

In order to allow your users to share the encrypted data with other users the iCure SDK needs to know the public keys of
the users.
The SDK will automatically retrieve the public keys of the users from the iCure server, but how can you be sure that the
public keys you are retrieving are the real public keys of the user?
If the iCure server got compromised the attacker could trick your users to share data with him instead of the intended
recipient.

You can be assured that we are doing our best to protect our servers, but if you want to be extra safe you can reduce
the trust you put in the iCure server by verifying the public keys of the users yourself, by implementing the
`verifyDelegatePublicKeys` of the crypto strategies interface.

When a user is about to share data with a new delegate user (*for the first time only*) the SDK will retrieve the public
key of the delegate user from the iCure server and call the `verifyDelegatePublicKeys` method of the crypto strategies.
You can then prompt the user to verify that the public key is correct using some external verification method and return
the result to the SDK.

Like for key recovery you can choose the verification method that best fits your application. For example, you could ask
the user to check the public key on the website of the doctor/clinic, or you could ask the user to scan a QR code
generated by the delegate user app.

:::note

Although not directly related to the crypto strategies, this concept of trust also applies to the give-access-back
mechanisms explained in the [how-to on a user losing his key](../how-to/how-to-authenticate-a-user/how-to-manage-lost-key#give-access-back-to-another-data-owner):
whenever you share data with a user you should verify that the user has actually made a request for access back, and that
the public key you received is really the new public key of the user.

:::

### Verification of own recovered keys

As previously mentioned iCure has some built-in mechanisms to recover the keys of your users.
Similarly to public keys, however, if iCure gets compromised the attacker may trick your user into "recovering" a key
pair which is actually controlled by the attacker, resulting in the attacker having access to all data encrypted with
such pair.

To prevent this from happening the iCure SDK will only use keys recovered through iCure means for decryption of existing
data and NOT for the encryption of new data unless the user verifies the keys through the `recoverAndVerifyKeys` method
(custom key recovery and key verification are done by the same method).

:::note

This means that if a key pair is recovered through iCure means and the user does not verify it, then new AC keys
will be generated for the user, which as explained in the section on [anonymous data sharing](#anonymous-data-sharing)
is detrimental to the performances of the application for *anonymous* data owners.

:::

Key verification is generally not as important as recovery, since it has no impact on the availability of data, however
it is much simpler to implement and use verification rather than recovery.
This is because verification only requires for the user to confirm that a certain public key belongs to a pair that he
has generated in the past.
Since the public key is not sensitive information it can be stored in clear or even printed, making it much easier for
the user to verify it.

Finally, key verification can also be applied to missing keys that are not recovered by iCure or by your custom recovery
method. Verifying a public key, even if the corresponding private key is missing, can help the iCure SDK to generate
recovery data that could potentially be used to recover other key pairs in the future.

## Simple crypto strategies

The iCure SDK provides a default implementation of the crypto strategies interface, the `SimpleCryptoStrategies`.

You can use the `SimpleCryptoStrategies` to kickstart the development of your application, but you should always replace
them with a real custom implementation before releasing your application.

The `SimpleCryptoStrategies` do not provide any key recovery mechanism by themselves and fully trust the iCure server
(no key verification is done). You can also pass in input some key pairs which you think may not be available on the
device, so they will be considered as recovered, but this is not necessary.

## Further reading

For more details on how to implement the crypto strategies interface please refer to the [API documentation](../references/modules).
