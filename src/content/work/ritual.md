---
name: Ritual
service: Brand, product design and native iOS rebuild
category: mobile
summary: Our own habit tracker for iPhone. We designed the brand and every screen, rebuilt the app from scratch in SwiftUI and shipped four releases in a week, in 35 languages.
keywords: [habit tracker, habits, ritual, ios, iphone, app, swiftui, rebuild, onboarding, revenuecat, paywall, a/b testing, freemium, widgets, notifications, apple health, posthog, analytics, localization, illustration, branding]
image: /uploads/ritual-screen.webp
preview: /uploads/ritual-preview.webp
imageKind: phone
tint: peach
order: 31
platform: iPhone (SwiftUI)
scope: Brand and icon, illustration, product design, native SwiftUI rebuild, onboarding, Apple Health, widgets, notifications, RevenueCat freemium and paywall tests, PostHog analytics, localization in 35 languages, App Store screenshots
challengeTitle: A habit app without the pressure
challenge: |-
  Most habit trackers punish you. Miss a day and the streak turns red, the app nags, and a week later you delete it. Ritual is built on the opposite idea: one ritual at a time, rest days that count, and a garden that grows when you show up.

  A rebuild, not a patch. The app had to be rebuilt from scratch as a native SwiftUI app, on the same bundle ID, so every existing user simply got an update.

  Calm, but a business. Freemium rules, paywalls and experiments had to be flexible enough to change without a new release.

  Everywhere at once. 35 languages, so every release reads native wherever it lands.
approachTitle: Soft Grain, rebuilt native
approach: |-
  Brand. A warm paper look we call Soft Grain: cream and sand, a dark brown ink, one bright orange and a garden green. Instrument Serif for headlines with one word in italic orange, Instrument Sans for the interface, and Caveat for handwritten notes, the kind you would stick on a fridge. The icon is a seed sprouting under a warm sky: small start, steady growth.

  The rebuild. From our Soft Grain designs we rebuilt Ritual natively in SwiftUI, keeping the bundle ID. Version 2.0 shipped the whole app: a 13 step onboarding in light and dark, Home with the week and the streak, ritual detail, timers, water and reading logs, Apple Health, reminders, rest days, data export and four paywall designs. Then we kept going. 2.1 gave every ritual its own room, added new rituals, the meadow with seasonal plants, widgets and a weekly recap you can share. 2.2 added a plan paywall built from the onboarding answers. 2.3 brought a What's New screen in all 35 languages and analytics. Four releases in about a week.

  Onboarding. Thirteen steps from "This isn't a to do list" to a signed personal commitment. It asks what you want to focus on, what gets in the way and how many hours slip by, picks a first ritual with you, connects Apple Health and reminders and offers the trial. Every answer becomes a profile property, so the app and the funnel both know who they are talking to.

  Rooms and guided sessions. Box breathing with an orb that grows and shrinks and a haptic tap on every count. A pond timer with a bell. Six morning stretches, 30 seconds each. One journal question a day. A five step wind down while the screen gets darker. When a session ends the ritual ticks itself off, seeds go to the garden and mindful minutes are saved to Apple Health. Programs from 7 to 21 days build a routine one ritual at a time.

  Apple Health. Walks, sleep, workouts and mindful minutes complete rituals on their own, with nothing to tap. Health data stays on the iPhone.

  Widgets. Today in small, medium and large, interactive, so you tick a ritual or log a glass of water right on the widget. A streak widget, and ring, line and text widgets for the Lock Screen.

  Notifications. Every ritual has its own reminder text. Reminders are actionable from the Lock Screen: mark it done, snooze 10 minutes or log a glass. Smart nudges cover a streak at risk, a rest day used, a milestone and the end of the trial, and an evening check in asks how the day felt. Reminders learn when you usually show up.

  Freemium and RevenueCat. Free gets 2 rituals, check offs, streaks, rest days, reminders, Apple Health and mood check ins. Pro unlocks unlimited rituals and mood patterns, with a 7 day trial on yearly. RevenueCat offering metadata picks the paywall design (main, garden, plan or price), the number of free rituals and whether the paywall is hard or soft. The paywall shows once after onboarding and can be closed, then only at the third ritual, the patterns card or See plans. The experiment plan tests main vs garden, 2 vs 3 free rituals, hard vs soft, price and trial length. People leaving get a win back offer: 50% off for 3 months on monthly, a free month on yearly.

  Analytics. PostHog, anonymous, with every onboarding step tracked from onboarding_01 to onboarding_13, paywall views and closes with seconds on screen, every purchase state, completed rituals, sessions and programs. Profile properties hold focus, challenges, first ritual, rhythm, first plant, language, country and Pro, so every funnel can be split by them.

  Reviews and sharing. The rating prompt never shows in the first 3 days, at most every 90 days and once per version, and unhappy answers go to private feedback instead of the App Store. From day three you can share your streak as an image, or invite a friend.
resultsTitle: The build in numbers
results:
  - { value: "4", label: "releases in about a week" }
  - { value: "35", label: "languages" }
  - { value: "13", label: "onboarding steps, each one tracked" }
gallery:
  - { image: /uploads/ritual-cs-rebuild.webp, caption: "Rebuilt native on the same bundle ID, then four releases", kind: board }
  - { image: /uploads/ritual-cs-glance.webp, caption: "The build at a glance", kind: board }
  - { image: /uploads/ritual-cs-onboarding.webp, caption: "Thirteen onboarding steps, ending with a signed commitment", kind: board }
  - { image: /uploads/ritual-cs-rooms.webp, caption: "The Rituals tab: every ritual gets a room", kind: board }
  - { image: /uploads/ritual-cs-health.webp, caption: "Apple Health auto complete, programs and the wind down", kind: board }
  - { image: /uploads/ritual-cs-widgets.webp, caption: "Interactive widgets for the Home Screen and the Lock Screen", kind: board }
  - { image: /uploads/ritual-cs-notifications.webp, caption: "Actionable reminders and smart nudges", kind: board }
  - { image: /uploads/ritual-cs-revenuecat.webp, caption: "Freemium rules and paywall experiments driven by RevenueCat", kind: board }
  - { image: /uploads/ritual-cs-analytics.webp, caption: "Every onboarding step measured in PostHog", kind: board }
  - { image: /uploads/ritual-cs-store.webp, caption: "The App Store screenshots", kind: board }
  - { image: /uploads/ritual-cs-languages.webp, caption: "35 languages, every release", kind: board }
---
