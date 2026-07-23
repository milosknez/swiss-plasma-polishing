# How to replace the images on the website

Some photos on the site are temporary stand-ins. They are there so the site can
go live now, and you can swap in the real photos later, one at a time, without
touching the design. This guide explains how.

There are two ways to do it. Pick whichever is easier for you.

---

## Option A (easiest): ask Claude Code

If you have the site open in Claude Code, you do not need to know any code. Just
drag your new photo into the chat and write, in plain English, where it should
go. For example:

> Replace the "after" photo in the before/after slider on the home page with
> this image.

or

> Put this image as the hero photo on the bent stainless tube case study page.

Claude Code will convert the image to the right format, put it in the correct
place, and you can publish. That is all.

---

## Option B (manual): swap the file yourself

Every photo lives in the folder `assets/img/` as a `.webp` file. If you replace
a file with a new one **that has the exact same name**, the new photo shows up
everywhere that photo is used, and nothing else needs to change.

Steps:

1. Save your new photo.
2. Convert it to WebP and give it the same name as the one you are replacing.
   The quickest way is the helper script in the project:

   ```bash
   ./scripts/convert-images.sh my-new-photo.png
   ```

   That creates `my-new-photo.webp`. Rename it to match the file you are
   replacing (see the list below), and drop it into `assets/img/`, overwriting
   the old one.
3. Publish.

---

## Which file is which

| Where you see it | File in `assets/img/` | Status |
| --- | --- | --- |
| Home page, big hero photo | `hero.webp` | Real photo |
| Home page, "before / after" slider | `ba-photo.webp` | **Stand-in** |
| Home page, "Bath process" photo | `bath.webp` | **Stand-in** |
| Home page, "Jet process" photo | `jet.webp` | **Stand-in** |
| Home page, case studies spotlight (default) | `case.webp` | **Stand-in** |
| Case study: bent stainless tube | `case-bent-tube.webp` | Real photo |
| About page, top photo | `about-hero.webp` | **Stand-in** |

Anything marked **Stand-in** is safe to replace whenever you have the real
photo. The two marked "Real photo" are already the images you supplied.

---

## Special case: the "before / after" slider on the home page

Right now the slider shows the **same photo on both sides**, so dragging the
handle shows no difference. To make it a real before/after, you need **two**
photos: one of the rough surface (before) and one of the polished surface
(after).

The easiest path is Option A: drag both photos into Claude Code and say

> Use this as the "before" and this as the "after" in the home page slider.

If you prefer to do it by hand, the slider is in `index.html`. It has two image
layers, one labelled "After" and one labelled "before". Point each one at its
own photo (for example `ba-after.webp` and `ba-before.webp`) and you are done.

---

## A note on the case studies

Four of the five case studies currently show an **"In preparation"** notice
instead of the full story, because the text is not written yet. When you send
the write-up for a case, the full layout (overview, specifications, story with
photos) can be brought back. The **dental** case study is already fully built
and is the reference for how a finished case looks.
