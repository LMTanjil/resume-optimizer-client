# Greeting Messages

The message set for the welcome toast ([functional-requirements.md FR-GREET-01](functional-requirements.md#fr-greet-01-welcome-toast)). Implemented as `GREETINGS` in `src/constants/index.js`, and selected by `hooks/useGreeting.js`.

**Rules**

- `{name}` is the display name: `user.name`, or the email prefix before `@`.
- Priority: **holiday → weekend → time sub-band**. Only one message is shown, picked at random from the bucket.
- **Register** messages are for brand-new users ("welcome"). **Login** messages are for returning users ("welcome back").
- Holidays are single days: Jan 1, Dec 25, Easter Sunday (calculated).
- Weekend = Saturday and Sunday. Time bands use the user's local time; the start hour is inclusive and the end hour exclusive.

---

## 1. Holidays

### New Year (Jan 1)

| Login                                                                | Register                                                               |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Happy New Year, {name}! 🎆 New year, new resume?                     | Happy New Year, {name}! 🎆 What a day to start fresh with ResumeAI.    |
| Welcome back, {name}! Let's make this year's first move a great one. | Welcome, {name}! New year, new goals. Let's build the resume to match. |

### Easter Sunday

| Login                                                   | Register                                                     |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| Happy Easter, {name}! 🐣 Thanks for stopping by.        | Happy Easter, {name}! 🐣 Welcome to ResumeAI.                |
| Welcome back, {name}! Hope your Easter is a bright one. | Welcome, {name}! A fresh start on a fresh-start kind of day. |

### Christmas (Dec 25)

| Login                                                         | Register                                          |
| ------------------------------------------------------------- | ------------------------------------------------- |
| Merry Christmas, {name}! 🎄 Good to see you.                  | Merry Christmas, {name}! 🎄 Welcome to ResumeAI.  |
| Welcome back, {name}! A little career gift to yourself today? | Welcome, {name}! Here's to next year's dream job. |

---

## 2. Weekend (Saturday and Sunday)

| Login                                                      | Register                                                               |
| ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| Happy weekend, {name}! A relaxed day for a resume refresh. | Welcome, {name}! A weekend start, nice and unhurried.                  |
| Welcome back, {name}! Weekend hustle, respect. 💪          | Welcome aboard, {name}! Great weekend project: your next career move.  |
| Hey {name}, no rush today. Polish at your own pace.        | Hi {name}! Glad you're here. Let's build something great this weekend. |

---

## 3. Time sub-bands

### Morning

| Sub-band      | Hours | Login                                                               | Register                                                     |
| ------------- | ----- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Early morning | 05–07 | Up with the sun, {name}? ☀️ Welcome back.                           | Early start, {name}! Welcome to ResumeAI.                    |
|               |       | Good early morning, {name}. The quiet hours are the best for focus. | Welcome, {name}! An early-bird start to your new resume.     |
| Morning       | 07–09 | Good morning, {name}! ☕ Ready to get to work?                      | Good morning, {name}! Welcome to ResumeAI.                   |
|               |       | Morning, {name}! Fresh coffee, fresh ideas.                         | Morning, {name}! Great way to start the day. Welcome aboard. |
| Mid-morning   | 09–11 | Welcome back, {name}! The morning's in full swing.                  | Welcome, {name}! Let's make this morning count.              |
|               |       | Hey {name}, good to see you this morning.                           | Hi {name}! Your resume journey starts now.                   |
| Late morning  | 11–12 | Almost lunchtime, {name}. Let's squeeze in some progress.           | Welcome, {name}! A great late-morning start.                 |
|               |       | Welcome back, {name}! Perfect timing before the lunch break.        | Hi {name}! Glad you joined before lunch.                     |

### Afternoon

| Sub-band       | Hours | Login                                                         | Register                                                            |
| -------------- | ----- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| Midday         | 12–13 | Lunch-break hustle, {name}? 🥪 Welcome back.                  | Welcome, {name}! Lunch break well spent.                            |
|                |       | Good afternoon, {name}! Midday check-in.                      | Hi {name}! A midday start. Let's get going.                         |
| Afternoon      | 13–15 | Good afternoon, {name}! Let's keep the momentum.              | Good afternoon, {name}! Welcome to ResumeAI.                        |
|                |       | Welcome back, {name}! Afternoon focus mode: on.               | Welcome aboard, {name}! Let's build something great this afternoon. |
| Late afternoon | 15–17 | Welcome back, {name}! A late-afternoon push.                  | Welcome, {name}! A strong finish to the afternoon.                  |
|                |       | Hey {name}, the home stretch of the day. Let's make it count. | Hi {name}! Perfect time to start something new.                     |

### Evening

| Sub-band      | Hours | Login                                                       | Register                                              |
| ------------- | ----- | ----------------------------------------------------------- | ----------------------------------------------------- |
| Early evening | 17–18 | Good evening, {name}! Wrapping up the day?                  | Good evening, {name}! Welcome to ResumeAI.            |
|               |       | Welcome back, {name}! Workday's winding down. Time for you. | Welcome, {name}! A great way to end the workday.      |
| Evening       | 18–20 | Good evening, {name}! 🌆 Let's pick up where you left off.  | Good evening, {name}! Glad you're here.               |
|               |       | Evening, {name}! A calm time for career moves.              | Welcome aboard, {name}! Evening ambition. We like it. |
| Late evening  | 20–21 | Welcome back, {name}! Settling in for the evening?          | Welcome, {name}! A cozy evening start.                |
|               |       | Hey {name}, a little evening polish goes a long way.        | Hi {name}! Let's make tonight productive.             |

### Night

| Sub-band    | Hours | Login                                                              | Register                                                              |
| ----------- | ----- | ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Night       | 21–23 | Night-owl mode, {name}? 🌙 Welcome back.                           | Welcome, {name}! Night-time focus, let's do this. 🌙                  |
|             |       | Welcome back, {name}! The quiet of the night is perfect for focus. | Hi {name}! A late start is still a great start.                       |
| Midnight    | 23–01 | Burning the midnight oil, {name}? 🕯️                               | Welcome, {name}! Midnight inspiration struck?                         |
|             |       | Welcome back, {name}! Midnight edits hit different.                | Hi {name}! Big plans at midnight. Love it.                            |
| Small hours | 01–05 | Still up, {name}? Welcome back, and don't forget to rest. 💤       | Welcome, {name}! Late night or early morning, we're glad you're here. |
|             |       | Hey {name}, small-hours grind. Let's keep it quick.                | Hi {name}! The world's asleep. Perfect time to plan your next move.   |

---

## 4. Implementation notes

- `constants/index.js`:
  - `GREETINGS = { holiday: { newYear: { login: [], register: [] }, easter: {…}, christmas: {…} }, weekend: { login: [], register: [] }, time: { earlyMorning: {…}, … } }`
  - `TIME_SUB_BANDS = [{ key: "earlyMorning", start: 5, end: 7 }, …, { key: "midnight", start: 23, end: 1 }, { key: "smallHours", start: 1, end: 5 }]`. The midnight band wraps past 24.
- `useGreeting()` returns `getGreeting(mode: "login" | "register", name: string, now = new Date())`. The `now` parameter makes manual checks easy.
- Easter: the anonymous Gregorian algorithm (Meeus/Jones/Butcher), computed for `now.getFullYear()`.
