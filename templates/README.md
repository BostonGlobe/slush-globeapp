# APPNAME

This project was generated with [slush-globeapp](https://github.com/BostonGlobe/slush-globeapp). Consult its [README](https://github.com/BostonGlobe/slush-globeapp) for more information.

Please note: do not reproduce Boston Globe logos or fonts without written permission.

## Setup
Clone repo and run `npm i`.

If pulling from google or methode, run the command(s) below to stay up-to-date:

`gulp fetch-google` and `gulp fetch-methode`.

To start the local server, run `gulp`.

## Copy

You can pull copy from either [Methode](#methode) or a [Google Doc](#google-doc).

#### Methode
So you want to tussle with Methode huh? You are brave. Fill out `config.js` like such:

```
	...
	methode: {
		story: [{path: 'path/to/xml'}]
	}

```

This pipes text and images from Methode into methode.hbs and downloads the images locally.

To insert a graphic partial inside methode, simply create a new p tag and use the convention `{{graphic:test}}`. Make sure you have the partial `src/html/partials/graphic/test.hbs`.

Running `gulp fetch-methode` at any point will pull down the latest.

##### Methode image options:

*imageDirectory*

Takes a string. The location of the folder you want to put these images. The default is `assets/`, so anything entered will be appended to that. The folder must exist before you run the gulp command.

Example:

``` imageDirectory: 'photos'```

*imageLibrary*

Takes a string. The responsive image library you want to use instead of plain old ```img``` elements. Possible values include: ```picturefill, lazy-picturefill```. You are responsible for setting up the JavaScript to make them work (simply `npm i` `picturefill` and optionally `lazysizes`).

Example:

``` imageLibrary: 'lazy-picturefill'```

*imageClass*

Boolean value `true` or `false` to give different images from Methode a distinguising class name.

Example:

``` imageClass: true ```

#### Google Doc
Using a shared google doc for all copy for an interactive is recommended. The app uses [ArchieML](http://archieml.org) as a micro CMS.

*Setup google doc*
- Create a google doc (outside of Globe domain)
- Publish to web: file -> publish to web
- Make public: share button -> advanced -> change "private only you can access" to "public on the web"
- In the address bar, grab the ID
	- ...com/document/d/ **1IiA5a5iCjbjOYvZVgPcjGzMy5PyfCzpPF-LnQdCdFI0** /edit
- In `config.js` paste in the ID

If the data is too sensitive or a google doc is overkill, you can update `data/copy.json` directly.

Running `gulp fetch-google` at any point will pull down the latest.

## Fonts
The only two fonts loaded by default are **Miller regular** and **Benton bold**. To load additional fonts you must add info to two places. Follow the current examples in the existing files.
* **src/css/config.styl**
* **src/js/utils/misc/setupDefaultApps.js**

In **main.styl**:
```
set-font('benton-regular')
```

In **setupDefaultApps.js*:
```
loadFont([
	...
	{ family: 'Benton', suffix: 'regular', weight: 400 },
])
```
To set a font, simply add the class name to the element following the pattern `'.family-style'` (ex. `.benton-regular`)

Available fonts:
* `{ family: 'Miller', suffix: 'regular', weight: 400 }` - `.miller-regular`
* `{ family: 'Miller', suffix: 'regular', weight: 600 }` - `.miller-bold`
* `{ family: 'Miller-Banner', suffix: 'regular', weight: 400 }` - `.miller-banner-regular`
* `{ family: 'Miller-Banner', suffix: 'italic', weight: 400 }` - `.miller-banner-italic`
* `{ family: 'Benton', suffix: 'regular', weight: 400 }` - `.benton-regular`
* `{ family: 'Benton', suffix: 'regular', weight: 600 }` - `.benton-bold`
* `{ family: 'Benton-Cond', suffix: 'regular', weight: 400 }` - `.benton-cond-regular`
* `{ family: 'Benton-Comp', suffix: 'regular', weight: 400 }` - `.benton-comp-regular`

## Teasers
Run `gulp fetch-teaser` to pull down the teaser information (based on urls in meta.json).

## SEO and Analytics
Fill out *data/meta.json*, the bare minimum needed for seo, analytics, and business.

```
{
	"title": "Graphic title",
	"author": "Author name",
	"description": "Description of graphic",
	"keywords": "Comma, delimited, for, seo",
	"url": "https://apps.bostonglobe.com/graphics/path/to/graphic",
	"imageUrl": "https://apps.bostonglobe.com/graphics/path/to/image",
	"section": "Metro",
	"sectionUrl": "https://bostonglobe.com/metro",
	"credits": "",
	"teasers": [],
	"meter": true,
	"socialConnect": true,
	"ads": false
}
```

* **credits** text of who made this
* **teasers**: array of urls


## Deploy
#### Step 1: gulp
- Run `gulp prod -u username` to deploy. Outputs files into `dist/prod` folder in root.
- Optional: Use the flag `--html` to only upload the index.html file (use this if you have no updates to assets and want faster upload)
- Your graphic is now internally visible at http://dev.apps.bostonglobe.com/graphics/[year]/[month]/[graphic-name].

#### Step 2: publish assets
- In Terminal, connect to shell (your username is usually first initial last name): `ssh rgoldenberg@shell.boston.com`.
- Navigate to your graphic directory: `cd /web/bgapps/html/graphics/[year]/[month]/[graphic-name]`.
- Run the command `upload *` in the root **and** each subdirectroy. (ex. `cd css`, then `upload *` to upload all files in that folder).

### Public url
- **https**://apps.bostonglobe.com/graphics/[year]/[month]/[graphic-name]
- A zipped archive is also pushed to apps. It has the full unminified code for the future when gulp and stuff are fossils.
