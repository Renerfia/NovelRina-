# TopBar Design and Color Architecture

## Component

- Source: `src/components/TopBar.vue`
- Purpose: Displays the NovelRina logo and title, authentication actions, and the signed-in user button.
- Layout: A horizontal, rounded toolbar with the logo and title on the left and authentication controls on the right.

## Color Palette

| Token | Value | Usage |
| --- | --- | --- |
| `--color-page-bg` | `#e8e9eb` | Page background |
| `--color-surface-gray` | `#d4d6d9` | Main top-bar gradient start |
| `--color-surface-gray-hover` | `#c9cbd0` | Reserved surface hover/mute color |
| `--color-snow-white` | `#fffafa` | Button background |
| `--color-text-primary` | `#242629` | Heading and button text |
| `--color-text-muted` | `#5f6368` | Signed-in email text |
| `--color-border` | `#ffffff` | Top-bar border |
| `--color-glow` | `rgba(255, 255, 255, 0.9)` | Top-bar and button glow |

## Top-Bar Styling

### Container

- Display: `flex`
- Alignment: Centered vertically
- Gap: `14px` desktop, `10px` below `480px`
- Padding: `14px 20px` desktop, `12px` below `480px`
- Border: `1px solid var(--color-border)`
- Corner radius: `16px`
- Background: Linear gradient at `135deg` from `var(--color-surface-gray)` to `#cdd0d4`
- Shadow:
  - `0 0 8px var(--color-glow)`
  - `0 0 22px rgba(255, 255, 255, 0.55)`
  - `0 8px 20px rgba(36, 38, 41, 0.1)`

### Logo

- Image width: `42px` desktop
- Image height: `42px` desktop
- Image sizing: `object-fit: contain`
- Mobile width: `36px` below `480px`
- Mobile height: `36px` below `480px`

### Brand Heading

- Color: `var(--color-text-primary)`
- Font size: `1.25rem` desktop
- Font weight: `650`
- Letter spacing: `0.01em`
- Mobile font size: `1.05rem` below `480px`

### Authentication Controls

- Container display: `flex`
- Desktop gap: `10px`
- Container alignment: Pushed to the right with `margin-left: auto`
- Buttons use the `--color-snow-white` background and `--color-text-primary` text
- Border: `1px solid rgba(36, 38, 41, 0.08)`
- Corner radius: `999px` pill shape
- Shadow: `0 2px 8px rgba(36, 38, 41, 0.08)`
- Font weight: `600`
- Padding: `9px 16px` desktop
- Mobile padding: `8px 12px` below `480px`
- Transition: Background color, box shadow, and transform over `0.2s ease`

### Interactive State

- Hover background: `#ffffff`
- Hover shadow: `0 0 10px var(--color-glow)`
- Hover movement: `transform: translateY(-1px)`

### Signed-In User Button

- Right-aligned inside a flex container
- Top margin: `12px`
- Email text color: `var(--color-text-muted)`

## Responsive Behavior

At widths of `480px` or less, the top bar reduces its spacing and padding, scales down the logo and title, and reduces the button padding to maintain a compact mobile layout.

## Color Tokens Defined In

The design color variables are defined in `src/assets/base.css` and are imported through `src/assets/main.css` for global application.

## Home View Design

- Source: `src/views/HomeView.vue`
- Background: Uses the gray `--color-page-bg` palette with a glass-style overlay and a transparent background-image slot.
- Background image slot: `.home-page` defines `--home-background-image: none`. Replace this value with an image URL, for example `url('/images/home-background.jpg')`, to add an image later.
- Glass door panel: `.home-main` combines a translucent gray background, a white border, blur, soft white glow, and a downward shadow.
- Floating cards: Four PrimeVue cards use white-gray translucency, rounded `30px` corners, white borders, blur, and soft shadows.
- Card hover: Cards lift upward by `5px` and gain a stronger glow.
- Main button: A circular floating button is centered between all four cards using the same pill-style text, white-gray gradient, border, glow, and shadow as the top bar controls.
- Desktop layout: A three-column grid places two cards on each side of the center button.
- Mobile layout: Below `780px`, cards and the main button stack in one column, preserving the visual order and theme.
- Reduced motion: Floating transitions are disabled when the user requests reduced motion.

## Authentication Dialogs

- Sources: `src/components/LoginDialog.vue` and `src/components/RegisterDialog.vue`
- State owner: `HomeView.vue` owns one `activeAuthDialog` value: `null`, `login`, or `register`.
- Dialog behavior: PrimeVue `Dialog` provides modal positioning and mobile sizing. Each child is mounted only when active and is rendered with `:visible="true"`.
- Background interaction: The dialog backdrop does not dismiss the dialog because `dismissable-mask` is disabled; the custom close button emits `close`.
- Desktop size: Dialog width is limited to `420px` and uses the same rounded glass styling as the home panel.
- Mobile size: Dialog width is `94vw`, with reduced header and content padding below `480px`.
- Login and register forms: Plain labeled inputs keep the implementation easy to understand while Supabase handles authentication.
- Top-bar connection: `TopBar.vue` has named `handleSignIn()` and `handleSignUp()` functions. Each handler emits an event to `HomeView.vue`, which sets `activeAuthDialog` to the matching value.
- Dialog switching: The login dialog emits `switch-register`; the register dialog emits `switch-login`. `HomeView.vue` changes the single active state, so only one dialog is mounted.
- Close communication: The custom close button calls a simple `closeDialog()` function in each component. Each component emits a function-style `close` event after the close button or successful login; `HomeView.vue` sets the active dialog to `null`. The dialog components do not receive a visible prop or forward PrimeVue `update:visible` events.
- Main button connection: The center `Ready to write?` button opens the registration dialog.
- Authentication colors: Dialogs use a dark glass-gray background, white text and labels, white borders, and white glow accents.
- Dialog header: The NovelRina logo appears beside the dialog title at the top of the login and registration dialogs, with a circular custom close button on the right.
- Form boxes: Email and password inputs use a square-style `4px` corner radius and a translucent dark-gray glass background.
