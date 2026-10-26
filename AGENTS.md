<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Menu architecture
- Keep the complete menu in the browser-safe `src/lib/menu.ts` data module; the page renders both navigation and sections from the same categories to prevent drift.
- Use hash anchors for this explicitly requested single-page menu; category cards and navbar links must target the same section IDs.
- Keep all reusable visual styling and semantic palette tokens in `src/styles.css` so the mobile-first layout remains consistent.

## Brand icons
- The browser-tab and home-screen icons in `public/` are always derived from the Le Mabillon brand mark (`src/assets/mabillon-mark.png`), never a default platform icon; regenerate both from that master whenever the mark changes so the tab and home screen stay on-brand.

## Menu du jour
- Daily menu lives in the `daily_menu_items` table (public read, admin-only writes via `has_role`); the first account ever created is granted admin by a database trigger, so only the owner can edit at `/admin`.
