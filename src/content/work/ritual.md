---
name: Ritual
service: Brand, product design and native iOS rebuild
category: mobile
summary: Our own habit tracker for iPhone. We designed the brand and every screen, rebuilt the app from scratch in SwiftUI and shipped four releases in a week, in 35 languages.
keywords: [habit tracker, habits, ritual, ios, iphone, app, swiftui, rebuild, onboarding, revenuecat, paywall, a/b testing, freemium, widgets, notifications, apple health, posthog, analytics, localization, illustration, branding]
image: /uploads/ritual-screen.webp
preview: /uploads/ritual-preview.webp
card: /uploads/ritual-card.webp
icon: /uploads/ritual-icon.png
ownApp: true
appStore: https://apps.apple.com/us/app/ritual-habit-tracker-goals/id6757848730
tagline: Habits without the pressure. Rebuilt native in SwiftUI, then four releases in a week.
imageKind: phone
tint: peach
order: 0.7
platform: iPhone, SwiftUI
stack: WidgetKit, HealthKit, RevenueCat, PostHog
scope: Brand and icon, illustration, product design, native SwiftUI rebuild, onboarding, Apple Health, widgets, notifications, RevenueCat freemium and paywall tests, PostHog analytics, localization in 35 languages, App Store screenshots
challengeTitle: A habit app without the pressure
challenge: |-
  Most habit trackers punish you for a missed day. Ritual is one ritual at a time, rest days that count and a garden that grows when you show up. The app had to be rebuilt from scratch as a native SwiftUI app, on the same bundle ID, so existing users only noticed a better app, with pricing flexible enough to change without a release.
resultsTitle: The build in numbers
results:
  - { value: "4", label: "releases in about a week" }
  - { value: "35", label: "languages" }
  - { value: "13", label: "onboarding steps, each one tracked" }
  - { value: "4", label: "paywall designs, picked remotely" }
chapters:
  - title: The rebuild
    text: |-
      A warm paper look we call Soft Grain: cream and sand, a dark brown ink, one bright orange and a garden green. Instrument Serif for headlines with one word in italic orange, Instrument Sans for the interface, and Caveat for handwritten notes. The icon is a seed sprouting under a warm sky: small start, steady growth.

      From those designs we rebuilt Ritual natively in SwiftUI, keeping the bundle ID. 2.0 shipped the whole app: onboarding in light and dark, Home with the week and the streak, ritual detail, timers, water and reading logs, Apple Health, reminders, rest days, data export and four paywall designs. 2.1 gave every ritual its own room, added the meadow with seasonal plants, widgets and a shareable weekly recap. 2.2 added a plan paywall built from the onboarding answers. 2.3 brought a What's New screen in all 35 languages and analytics.
    image: /uploads/ritual-cs-rebuild.webp
  - title: At a glance
    text: |-
      Thirty five languages, thirteen onboarding steps, four paywall designs and one bundle ID kept through the rebuild.
    image: /uploads/ritual-cs-glance.webp
  - title: Onboarding
    text: |-
      Thirteen steps from "This isn't a to do list" to a signed personal commitment. It asks what you want to focus on, what gets in the way and how many hours slip by, picks a first ritual with you, connects Apple Health and reminders and offers the trial. Every answer becomes a profile property, so the app and the funnel both know who they are talking to.
    image: /uploads/ritual-cs-onboarding.webp
  - title: Every ritual gets a room
    text: |-
      Box breathing with an orb that grows and shrinks and a haptic tap on every count. A pond timer with a bell. Six morning stretches, 30 seconds each. One journal question a day. When a session ends the ritual ticks itself off, seeds go to the garden and mindful minutes are saved to Apple Health.
    image: /uploads/ritual-cs-rooms.webp
  - title: Apple Health and programs
    text: |-
      Walks, sleep, workouts and mindful minutes complete rituals on their own, with nothing to tap, and health data stays on the iPhone. Programs from 7 to 21 days build a routine one ritual at a time, and a five step wind down dims the screen as you go.
    image: /uploads/ritual-cs-health.webp
  - title: Widgets
    text: |-
      Today in small, medium and large, interactive, so you tick a ritual or log a glass of water right on the widget. A streak widget, and ring, line and text widgets for the Lock Screen.
    image: /uploads/ritual-cs-widgets.webp
  - title: Notifications
    text: |-
      Every ritual has its own reminder text. Reminders are actionable from the Lock Screen: mark it done, snooze 10 minutes or log a glass. Smart nudges cover a streak at risk, a rest day used, a milestone and the end of the trial, and an evening check in asks how the day felt.
    image: /uploads/ritual-cs-notifications.webp
  - title: Freemium and experiments
    text: |-
      Free gets 2 rituals, check offs, streaks, rest days, reminders, Apple Health and mood check ins. Pro unlocks unlimited rituals and mood patterns, with a 7 day trial on yearly.

      RevenueCat offering metadata picks the paywall design (main, garden, plan or price), the number of free rituals and whether the paywall is hard or soft. The paywall shows once after onboarding and can be closed, then only at the third ritual, the patterns card or See plans. The experiment plan tests main vs garden, 2 vs 3 free rituals, hard vs soft, price and trial length. People leaving get a win back offer: 50% off for 3 months on monthly, a free month on yearly.
    image: /uploads/ritual-cs-revenuecat.webp
  - title: Analytics
    text: |-
      PostHog, anonymous, with every onboarding step tracked from onboarding_01 to onboarding_13, paywall views and closes with seconds on screen, every purchase state, completed rituals, sessions and programs. Profile properties hold focus, challenges, first ritual, rhythm, first plant, language, country and Pro, so every funnel can be split by them.
    image: /uploads/ritual-cs-analytics.webp
  - title: The App Store page
    text: |-
      Screenshots illustrated in the same hand as the app, the sun, the garden path and the sticky notes, with serif headlines and one handwritten word.
    image: /uploads/ritual-cs-store.webp
  - title: 35 languages
    text: |-
      The app and its What's New notes ship in all 35, so a release reads native everywhere. Language is also a profile property, so every funnel can be split by it. The rating prompt never shows in the first 3 days, and unhappy answers go to private feedback instead of the App Store.
    image: /uploads/ritual-cs-languages.webp
---
