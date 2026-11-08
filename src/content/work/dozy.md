---
name: Dozy
service: Brand, product design and iOS app
category: mobile
summary: Our own sleep tracker and smart alarm for iPhone. We named it, drew the sloth, designed every screen, wrote 28k lines of SwiftUI and shipped it in 20 languages.
keywords: [sleep, sleep tracker, smart alarm, snoring, ios, iphone, app, mascot, illustration, branding, subscription, swiftui, revenuecat, paywall, a/b testing, widgets, localization, alarmkit, posthog, analytics, notifications, gamification]
image: /uploads/dozy-screen.webp
preview: /uploads/dozy-preview.webp
imageKind: phone
tint: lilac
order: 30
platform: iPhone (SwiftUI, iOS 26)
scope: Naming and brand, mascot and illustration, product design, iOS build, sleep engine, AlarmKit alarm, widgets, notifications, RevenueCat subscriptions and paywall tests, PostHog analytics, localization in 20 languages, App Store listing and previews
challengeTitle: A sleep app you actually want to open
challenge: |-
  Most sleep trackers read like a lab report: dense charts, medical words and a bright screen at 3 am. We wanted the opposite, an app that feels like a calm friend and still tells you something useful every morning.

  One clear answer. A single score from 0 to 100 each morning, with the detail one tap away.

  No wearable. Just the phone on the mattress, so the sleep engine has to be good.

  A character, not a dashboard. A sleepy sloth that mirrors your night and never judges it.

  A business, not a toy. Subscriptions, paywall experiments and analytics built in from day one, so we can learn what people pay for.
approachTitle: From a name and a sloth to 20 App Stores
approach: |-
  Name and brand. Dozy, a soft and sleepy name, with a sloth as the hero. The icon is the sloth hugging its pillow on a night sky. Nunito Black for the big friendly lines, Urbanist for the interface, and a palette from deep night to a bright purple with one colour per sleep stage. We drew a full set of sloth states and wrote the rules for when each one shows: live tracking first, then one off events, then last night's mood against your own average, then the time of day. The sloth is never sad and never blames you.

  The sleep engine. The phone reads the accelerometer at 10 Hz and listens for sound against a noise floor that adapts to the room. Every minute becomes one epoch, smoothed with actigraphy weights across the neighbouring minutes. Sleep starts after ten quiet minutes, stages are laid out on 90 minute cycles, and the morning score adds up duration (40), efficiency (20), deep and REM (20), how fast you fell asleep (10) and wake ups (10). Snoring and talking are caught as short clips that stay on the phone. Raw audio is never stored.

  Smart alarm and sounds. The alarm runs on AlarmKit, so it rings through silent mode and Focus like the Clock app. It waits for light sleep inside a 30 minute window, snooze works from the Lock Screen as a Live Activity, and if AlarmKit is not allowed it falls back to time sensitive notifications. The nine sleep sounds, from rain on leaves to fan hum, are synthesized live in code. No audio files ship with the app.

  Widgets and notifications. Four widgets: last night, bedtime countdown, start sleep and streak, designed for light and dark, with Lock Screen versions. Seven notification types, each with its own voice. "Psst. Bedtime in 15." comes with actions to start sleep or push it 15 minutes. If you ignore it, "Still up? Bold move." follows once, then nothing more that night.

  Subscriptions and A/B tests. Dozy Pro is $39.99 a year with a 7 day trial or $7.99 a month, sold through RevenueCat. Three paywall layouts ship in the app, each telling a different story about Pro: the night (features), the morning (trial timeline) and Free vs Pro. RevenueCat offering metadata decides which one people see, and one remote flag turns the soft paywall into a hard one, so every experiment is a dashboard change, not an App Store update. The layout is sent to RevenueCat as a subscriber attribute and to PostHog on every event, so each purchase is tied to the paywall that sold it.

  The moments that sell. The first morning paywall is personal: it shows how long you slept and what Dozy heard at night. Say no and a one time 40% offer appears on the third scored morning. The trial reminder lands on day 5, before anyone is charged. We also designed the retention message for Apple's cancel sheet in three options.

  Analytics. PostHog, written without an SDK: an anonymous ID, GeoIP off, an opt out toggle, events queued on the device and sent every 30 seconds. 25 events cover onboarding, nights, money and habits, from setup_check_result to second_chance_purchased, in one project shared with Ritual.

  Gamification. A bedtime streak with a weekly nap day, a weekly goal ring of 5 nights out of 7, score tiers from Restless to Legendary Sloth, 6 badges and a closet of 15 items the sloth earns from real habits: hats, outfits, cozy things and spots to sleep.

  Localization. 925 strings translated into 19 languages on top of English, from German and Japanese to Hungarian and Finnish. The App Store listing and all 7 App Store previews are redrawn for every language, with the headlines rewritten so the highlighted word still lands.

  Shipping. Every push builds in Xcode Cloud and goes to TestFlight, with a separate release workflow for the App Store. A setup check before the first night makes sure the phone is plugged in and alarms are allowed. The rating prompt only shows after a night of 80 or more, never in the first 3 mornings, and "Not really" opens private feedback instead of the App Store.
resultsTitle: The build in numbers
results:
  - { value: "28k", label: "lines of SwiftUI across 80 files" }
  - { value: "20", label: "languages, 925 strings each" }
  - { value: "3+1", label: "paywall layouts plus a remote hard switch" }
gallery:
  - { image: /uploads/dozy-cs-glance.webp, caption: "The build at a glance, every number from the code", kind: board }
  - { image: /uploads/dozy-icon.webp, caption: "The app icon: the sloth hugging its pillow on a night sky", kind: board }
  - { image: /uploads/dozy-sloths.webp, caption: "Sloth states, one for every moment of the night and the morning", kind: board }
  - { image: /uploads/dozy-system.webp, caption: "When is which sloth: the priority ladder and the morning mood scale", kind: board }
  - { image: /uploads/dozy-type.webp, caption: "Nunito Black and Urbanist, and a palette with one colour per sleep stage", kind: board }
  - { image: /uploads/dozy-cs-engine.webp, caption: "The sleep engine: from sensors to a score at 7am", kind: board }
  - { image: /uploads/dozy-cs-alarm.webp, caption: "AlarmKit smart alarm and nine sounds synthesized in code", kind: board }
  - { image: /uploads/dozy-cs-widgets.webp, caption: "Widgets for Home Screen, light and dark, and the Lock Screen", kind: board }
  - { image: /uploads/dozy-cs-notifications.webp, caption: "Seven notification types, with the real copy from the app", kind: board }
  - { image: /uploads/dozy-cs-paywalls.webp, caption: "Three paywalls switched by RevenueCat offering metadata", kind: board }
  - { image: /uploads/dozy-cs-retention.webp, caption: "The personal first morning paywall, the second chance offer and the cancel message", kind: board }
  - { image: /uploads/dozy-cs-analytics.webp, caption: "25 PostHog events, anonymous and without an SDK", kind: board }
  - { image: /uploads/dozy-cs-gamification.webp, caption: "Streaks, tiers, badges and the sloth's closet", kind: board }
  - { image: /uploads/dozy-cs-localization.webp, caption: "App Store previews redrawn in 20 languages", kind: board }
  - { image: /uploads/dozy-cs-ship.webp, caption: "Setup check, the rating flow and the road to TestFlight", kind: board }
  - { image: /uploads/dozy-store.webp, caption: "The App Store screenshots", kind: board }
---
