---
name: Dozy
service: Brand, product design and iOS app
category: mobile
summary: Our own sleep tracker and smart alarm for iPhone. We named it, drew the sloth, designed every screen, wrote 28k lines of SwiftUI and shipped it in 20 languages.
seoTitle: "Sleep tracker app design and SwiftUI build | Dozy"
keywords: [sleep, sleep tracker, smart alarm, snoring, ios, iphone, app, mascot, illustration, branding, subscription, swiftui, revenuecat, paywall, a/b testing, widgets, localization, alarmkit, posthog, analytics, notifications, gamification]
image: /uploads/dozy-screen.webp
preview: /uploads/dozy-preview.webp
card: /uploads/dozy-card.webp
icon: /uploads/dozy-icon.png
ownApp: true
appStore: https://apps.apple.com/us/app/dozy-sleep-tracker/id6775070929
tagline: A sloth for a coach, a sleep engine on the phone and a score every morning.
imageKind: phone
tint: lilac
order: 0.6
platform: iPhone, SwiftUI, iOS 26
stack: AlarmKit, WidgetKit, HealthKit, RevenueCat, PostHog, Xcode Cloud
scope: Naming and brand, mascot and illustration, product design, iOS build, sleep engine, AlarmKit alarm, widgets, notifications, RevenueCat subscriptions and paywall tests, PostHog analytics, localization in 20 languages, App Store listing and previews
challengeTitle: A sleep app you actually want to open
challenge: |-
  Most sleep trackers read like a lab report: dense charts, medical words and a bright screen at 3 am. We wanted a calm friend that still tells you something useful every morning, with no wearable, just the phone on the mattress, and a real business underneath: subscriptions, paywall tests and analytics from day one.
resultsTitle: The build in numbers
results:
  - { value: "28k", label: "lines of SwiftUI across 80 files" }
  - { value: "20", label: "languages, 925 strings each" }
  - { value: "3+1", label: "paywalls plus a remote hard switch" }
  - { value: "25", label: "analytics events, no SDK" }
chapters:
  - title: Brand and the sloth
    text: |-
      Dozy, a soft and sleepy name, with a sloth as the hero. The icon is the sloth hugging its pillow on a night sky. Nunito Black for the big friendly lines, Urbanist for the interface, and a palette from deep night to a bright purple with one colour per sleep stage.

      We drew a full set of sloth states and wrote the rules for when each one shows: live tracking first, then one off events, then last night's mood against your own average, then the time of day. The sloth is never sad and never blames you.
    image: /uploads/dozy-sloths.webp
    caption: Sloth states, one for every moment of the night and the morning
  - title: The system behind the sloth
    text: |-
      When is which sloth. A priority ladder decides what you see, and the morning mood scale maps the score to a face, so the app always feels consistent.
    image: /uploads/dozy-system.webp
  - title: Type and colour
    text: |-
      Nunito Black and Urbanist, and a palette with one colour per sleep stage, so the charts read at a glance at 7am.
    image: /uploads/dozy-type.webp
  - title: The sleep engine
    text: |-
      The phone reads the accelerometer at 10 Hz and listens for sound against a noise floor that adapts to the room. Every minute becomes one epoch, smoothed with actigraphy weights across the neighbouring minutes. Sleep starts after ten quiet minutes and stages are laid out on 90 minute cycles.

      The morning score adds up duration (40), efficiency (20), deep and REM (20), how fast you fell asleep (10) and wake ups (10). Snoring and talking are caught as short clips that stay on the phone. Raw audio is never stored.
    image: /uploads/dozy-cs-engine.webp
  - title: Smart alarm and sleep sounds
    text: |-
      The alarm runs on AlarmKit, so it rings through silent mode and Focus like the Clock app. It waits for light sleep inside a 30 minute window, snooze works from the Lock Screen as a Live Activity, and if AlarmKit is not allowed it falls back to time sensitive notifications.

      The nine sleep sounds, from rain on leaves to fan hum, are synthesized live in code. No audio files ship with the app.
    image: /uploads/dozy-cs-alarm.webp
  - title: Widgets
    text: |-
      Four widgets, last night, bedtime countdown, start sleep and streak, designed for light and dark, with Lock Screen versions. They read from a shared snapshot and deep link straight into the app.
    image: /uploads/dozy-cs-widgets.webp
  - title: Notifications
    text: |-
      Seven notification types, each with its own voice. "Psst. Bedtime in 15." comes with actions to start sleep or push it 15 minutes. If you ignore it, "Still up? Bold move." follows once, then nothing more that night.
    image: /uploads/dozy-cs-notifications.webp
  - title: Paywalls and A/B tests
    text: |-
      Dozy Pro is $39.99 a year with a 7 day trial or $7.99 a month, sold through RevenueCat. Three paywall layouts ship in the app, each telling a different story about Pro: the night (features), the morning (trial timeline) and Free vs Pro.

      RevenueCat offering metadata decides which one people see, and one remote flag turns the soft paywall into a hard one, so every experiment is a dashboard change, not an App Store update. The layout goes to PostHog on every event and the hard or soft mode to RevenueCat as a subscriber attribute, so each purchase is tied to the paywall that sold it.
    image: /uploads/dozy-cs-paywalls.webp
  - title: The moments that sell
    text: |-
      The first morning paywall is personal: it shows how long you slept and what Dozy heard at night. Say no and a one time 40% offer appears on the third scored morning. The trial reminder lands on day 5, before anyone is charged. We also designed the retention message for Apple's cancel sheet in three options.
    image: /uploads/dozy-cs-retention.webp
  - title: Analytics
    text: |-
      PostHog, written without an SDK: an anonymous ID, GeoIP off, an opt out toggle, events queued on the device and sent every 30 seconds. 25 events cover onboarding, nights, money and habits, from setup_check_result to second_chance_purchased, in one project shared with Ritual.
    image: /uploads/dozy-cs-analytics.webp
  - title: Gamification
    text: |-
      A bedtime streak with a weekly nap day, a weekly goal ring of 5 nights out of 7, score tiers from Restless to Legendary Sloth, 6 badges and a closet of 15 items the sloth earns from real habits: hats, outfits, cozy things and spots to sleep.
    image: /uploads/dozy-cs-gamification.webp
  - title: 20 languages
    text: |-
      925 strings translated into 19 languages on top of English, from German and Japanese to Hungarian and Finnish. The App Store listing and all 7 App Store previews are redrawn for every language, with the headlines rewritten so the highlighted word still lands.
    image: /uploads/dozy-cs-localization.webp
  - title: Shipping
    text: |-
      Every push builds in Xcode Cloud and goes to TestFlight, with a separate release workflow for the App Store. A setup check before the first night makes sure the phone is plugged in and alarms are allowed. The rating prompt only shows after a night of 80 or more, never in the first 3 mornings, and "Not really" opens private feedback instead of the App Store.
    image: /uploads/dozy-cs-ship.webp
  - title: The App Store page
    text: |-
      Seven App Store screenshots in the same night sky as the app, each one selling a single feature.
    image: /uploads/dozy-store.webp
---
