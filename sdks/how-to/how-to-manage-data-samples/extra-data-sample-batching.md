---
slug: advanced-data-sample-batching
description: Learn what is data sample batching.
sidebar_position: 100
tags:
- DataSample
- Optimisation
---

# Extra: data sample batching

:::info

This page is not necessary for usual usage of the SDK, but it can help you to improve the performance of your 
application. 

:::

For most api methods iCure offers a simple and bulk version of the operation, such as the `createOrModifyFor` and 
`createOrModifyManyFor` methods for `DataSample`s and `HealthcareElement`s.

For most types of entities the bulk methods simply allow to save a few web requests, but for `DataSample`s the bulk
operations provide even more advantages thanks to the concept of data sample "batches".

You will never need to handle directly data sample batches, as this is done automatically by the SDK, but knowing
about their existence and taking them in consideration when implementing your application can help you to improve
the performance of your application and reduce the amount of storage used.

## Why are data samples batched? And what does batching do?

In most iCure applications data samples will be the most common type of entity, which is why we put additional effort
into their optimisation.

For example a single doctor visit may produce many `DataSample`s, one for each type of measure taken/examination 
performed during the visit. At the same time the result of the visit may be the diagnosis of a single health condition,
represented by one `HealthcareElement`. In this case you could save all the `DataSample`s in a single batch instead of
saving them one by one.

A data sample batch is simply a group of data samples that share some internal metadata. This allows to save storage 
space and to speed up the decryption of the data samples in the batch.

There is no disadvantage to using data sample batches. Regardless of whether a data sample belongs to a batch or not,
you will always be able to retrieve it individually, and you will be also able to modify or share it separately from
other data samples part of the batch.

## Working with data sample batches

As previously mentioned you don't really need to handle data sample batches directly, but it can be useful to know
how they work to make sure that data samples are batched when possible.

When you create a data sample using the `createOrModifyManyFor` method, the SDK will automatically create a new data 
sample batch containing all the input data samples.

```typescript
// TODO code sample
// Create a batch with 4 data samples
```

Later you can share or modify the data samples of the batch as normal, however if you modify/share only a subset of 
data samples part of the batch they will be taken out of the original batch into a new separate batch.

```typescript
// TODO code sample
// Modify 2 of the data samples, then share 1 of the unmodified
// Explain we now have split data sample
// Explain that if instead you do modify and modify again the batch is gone.
```

The general rule is that in order to benefit the most from data sample batching you should always use bulk methods
to modify/share data samples.

## Data sample batch vs Compound data sample

Both data sample batches and [compound data samples](how-to-manage-datasamples-with-hierarchical-information.md) can 
group multiple data samples together, but in general data sample batches are more flexible than compound data samples:
you can't retrieve/share only part of a compound data sample.

As a rule of thumb you can use compound data samples to group measures that do not make sense on their own, such as
readings from different sensors of the same device, while you can use data sample batches when you want to group data
taken in a single event (e.g. one doctor visit) but that you later may want to examine/share separately.
