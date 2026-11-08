---
title: "How much it costs to design and build an iOS app, and what moves the price"
seoTitle: "iOS app design and development cost (2026)"
description: "Quotes for the same app idea can differ ten times. The difference is almost never the screens. It is five decisions most founders have not made yet."
category: Pricing
cover: /uploads/blog/cover-13.webp
date: 2026-11-08
draft: false
related: dozy
faq:
  - q: "How much does it cost to design an iOS app?"
    a: "It depends on how many flows the app has, whether you need a brand, and whether the same team also builds it. At Fackt, app projects start at $5,000 as a fixed project, and ongoing design is $6,900 a month."
  - q: "What makes an iOS app more expensive to build?"
    a: "Five things: the number of core flows, a backend and accounts, subscriptions and paywalls, system features like widgets, alarms and Health, and the number of languages. Each one adds design, code and testing."
  - q: "How can I lower the cost of building an app?"
    a: "Cut the first version to the one flow that delivers the first win, launch in one or two languages, and add widgets, extra paywalls and more languages after you see real usage."
---

You ask three studios to quote your app idea and get three numbers that have nothing in common. One is a few thousand, one is ten times that, one wants a discovery phase before they will say anything. They are probably all honest. They are just pricing different apps, because the brief left five decisions open.

**The price of an app is not set by the number of screens. It is set by five decisions: how many core flows, whether there is a backend, how you charge, which system features you use, and how many languages you ship in.** Make those decisions first and quotes start to agree.

Here is how each one moves the price, with our own apps as reference.

## 1. How many core flows

A flow is a path someone takes to get something done: track a night, log a habit, book a class. Most apps have one core flow and a few supporting ones (onboarding, settings, the paywall).

Every core flow needs its own screens, states and edge cases: empty, loading, error, first time, hundredth time. Two core flows is roughly double the work of one, not one and a half. The cheapest way to save money on an app is to launch with the one flow that delivers the first win.

## 2. A backend, or not

An app that keeps everything on the phone is much simpler than one with accounts, sync and a server. Dozy, our own sleep tracker, runs entirely on the device: the sleep scoring, the sounds, even the analytics queue. No login, no server to run.

The moment you need accounts, sharing between users or data on the web, you are building two products: the app and the system behind it. That is often the right call, but it should be a decision, not an accident.

## 3. How you charge

A paid app with no subscription is simple. A subscription app needs a paywall, trial logic, restore purchases, receipts and the states in between (in trial, expired, cancelled but still active).

Then there is the part that makes money: testing. Dozy ships three paywall layouts that RevenueCat switches remotely, a personal paywall on the first morning, a second chance offer and a trial reminder. That is real design and engineering time, and in a subscription app it is usually the best spent part of the budget.

## 4. System features

iOS gives apps powerful features, and each one is its own small project:

- **Widgets** for the Home Screen and Lock Screen, designed for light and dark.
- **Notifications** with actions, timing and copy.
- **Alarms** that ring through silent mode (AlarmKit on iOS 26).
- **Apple Health**, reading or writing.
- **Live Activities**, Siri and shortcuts.

Dozy uses most of these. Each added design work, code and testing on real devices. List the ones your first version truly needs.

## 5. How many languages

Translating strings is cheap. Doing localization properly is not: the App Store listing, screenshots redrawn per language, layouts that survive long German and Finnish words, and copy with personality rewritten instead of translated. Dozy ships in 20 languages and Ritual in 35, and that work is a project of its own.

Launching in one or two languages and adding more after you see where downloads come from is a sensible way to start.

## What our own apps took

As a reference for scope, not a price list: Dozy is about 28,000 lines of SwiftUI across 80 files, with a sleep engine, an AlarmKit alarm, nine synthesized sounds, four widgets, seven notification types, three paywalls and 20 languages. Ritual was rebuilt from scratch in SwiftUI and then shipped four releases in about a week.

Neither started that big. Both started with one flow that worked.

## What we charge

App projects start at $5,000 as a fixed project, for design or for design and SwiftUI build, depending on the five decisions above. Many teams start with a fixed project for the first version and move to ongoing design at $6,900 a month once the app is live and they are testing paywalls and onboarding every week.

## Make your brief quotable in one hour

Write one line for each:

1. The one core flow, and what the first win is.
2. Backend: on the phone only, or accounts and sync?
3. How it makes money: paid, subscription, or free for now?
4. The system features version one needs, and the ones that can wait.
5. Launch languages.

Send that to any studio and the quotes will finally be comparable.

## Why this is hard to see from the inside

When an idea is yours, every feature feels essential. An outside eye is useful exactly here: to find the one flow that proves the app, and to move everything else to version two without losing what makes it special.

If you want help scoping your app, book a call or start with the [free audit](/audit). You can see how far our own apps went in the [Dozy](/work/dozy) and [Ritual](/work/ritual) case studies.
