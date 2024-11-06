---
sidebar_position: 1
# This slug is important to keep, it is allowing the page to be loaded as the homepage instead of the classic landing page
slug: /
---

# Introduction

This documentation will guide you through the functionalities of the Cardinal SDK, that can be integrated in your logic
to access the functionalities of the Cardinal Backend.

The main purpose of the SDK is the **end-to-end encryption**: it encrypts the data before creating or modifying them and
it decrypts when retrieving. The only exceptions are the [base entities](/explanations/data-model/#base-entities) as
they are not supposed to contain sensitive data.

The SDK is currently available for Kotlin, Python, and Typescript. In each article of this documentation, you will find
the examples for all the languages.

This documentation is structured as follows:

- In the [Quickstart](/quickstart/index) section, you will find instructions and boilerplate code to quickly set up a project with Cardinal in
all the supported languages.
- In the [Tutorial](/tutorial) section, you will find example applications for the most common base use cases. The
code of these examples is fully explained and available in public GitHub repositories.
- In the [How To](/how-to/index) section, you will find explanations about how to implement your features with the
Cardinal SDK, each one with code examples in all the supported languages.
- In the [Explanation](/explanations/index) section, you will find additional material to understand the structure 
of the Cardinal SDK.

:::note
Before start using the Cardinal SDK, you have to [create your account on the Cockpit](cockpit/how-to/how-to-create-your-account)
:::
