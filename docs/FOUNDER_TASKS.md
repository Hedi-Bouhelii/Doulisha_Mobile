# Tasks for the founder

Steps that need your accounts or administrator rights. Each says what it unlocks.

## 1. Let the Android emulator run (needed now, part 3a)

The emulator needs hardware acceleration. Your processor supports it (virtualization is on in the firmware), but no hypervisor driver is installed, and installing one needs administrator rights.

1. Open **Android Studio → Settings → Languages & Frameworks → Android SDK → SDK Tools**.
2. Tick **Android Emulator hypervisor driver (installer)** and click **Apply**.
3. Open a **Command Prompt as administrator** and run:
   ```bat
   "%LOCALAPPDATA%\Android\Sdk\extras\google\Android_Emulator_Hypervisor_Driver\silent_install.bat"
   ```
   It should end with `STATE: 4 RUNNING`.
4. Check it: `"%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe" -accel-check` should say the driver is usable.

   If you would rather use Windows' own hypervisor: **Turn Windows features on or off → Windows Hypervisor Platform**, then restart the computer. Use one or the other, not both.

**Alternative:** plug in your Android phone with **USB debugging** on (Settings → About phone → tap "Build number" 7 times → Developer options → USB debugging). Then the app runs on the phone; it reaches your computer's server through your Wi-Fi address (see `.env.example`).

## 2. Delete the copied web documents from this folder

The session could not delete files. In `C:\Users\Hedi\Desktop\projects\doulisha-mobile`, delete `API.md`, `ARCHITECTURE.md`, `AUDIT.md`, `BUILD_PROMPT.md`, `DATABASE.md`, `DEPLOYMENT.md`, `OPEN_QUESTIONS.md`, `SOCIAL_SIGN_IN_SETUP.md`, `UX_GUIDELINES.md` and `cahier-des-charges-v2.pdf`. They are identical to the web repository's `docs/` and are not committed here (OPEN_QUESTIONS M2).

## Later (the step-by-step lists come with the part that needs them)

- **Expo account (free) and EAS project:** part 3d, for cloud builds and push notifications.
- **Firebase project:** part 3d, for push notifications on Android (Expo sends them through Firebase Cloud Messaging).
- **Google Play Console** (one-time fee; check the current amount): part 3d, to publish and to test App Links on real phones.
