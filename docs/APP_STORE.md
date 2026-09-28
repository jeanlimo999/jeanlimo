# Put Jean Limo on the App Store

The booking product is already the web app at https://jeanlimo.com/app.
Apple will not accept a website upload. You wrap that page in a small native iOS shell, then submit the shell from a Mac.

This environment cannot log into App Store Connect or run Xcode for you.

## What you need

1. Apple Developer Program — $99/year — https://developer.apple.com/programs/
2. A Mac with Xcode 26 or newer (Apple currently requires that SDK for new uploads)
3. App icons: 1024×1024 PNG, no transparency, no rounded corners (Apple rounds them)
4. Privacy policy URL (live): https://jeanlimo.com/privacy
5. Screenshots from an iPhone of /app Home, Book a Ride, My Reservations

## Recommended wrapper (Capacitor)

On your Mac, in this repo:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/status-bar
npx cap init "Jean Limo" com.jeanlimo.app --web-dir out
npx cap add ios
```

`capacitor.config.ts` is already in the repo and points the iOS web view at `https://jeanlimo.com/app`, so store updates to the website show up without a new App Store build for most booking UI changes.

Then:

```bash
npx cap open ios
```

In Xcode:

- Signing & Capabilities → your Team (the paid developer account)
- Bundle ID `com.jeanlimo.app` (must match App Store Connect)
- Display name: Jean Limo
- Version 1.0, Build 1
- Add the 1024 icon in Assets.xcassets / AppIcon
- Product → Archive → Distribute App → App Store Connect

## App Store Connect listing

- Name: Jean Limo
- Subtitle: Houston Black Car Service
- Category: Travel
- Age rating: 4+
- Privacy policy: https://jeanlimo.com/privacy
- Support URL: https://jeanlimo.com
- Description example:

  Book a private chauffeur in Houston. Airport transfers for IAH and Hobby, Galveston cruise rides, hourly service, and trip management. Pay securely in the app.

## Review notes Apple cares about

- This is a real-world transportation service, not a digital good. Stripe checkout for a car and driver is normally allowed.
- Provide a demo account if reviewers cannot complete a paid booking: the email + last-4 phone login on My Reservations.
- Do not hide the website-only pages behind the app if they are not part of the booking flow; the wrapper should open `/app` only.

## Fast alternative while the store review runs

On iPhone Safari: open https://jeanlimo.com/app → Share → Add to Home Screen. That is not the App Store, but customers can use it today.
