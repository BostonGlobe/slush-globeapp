# APPNAME

This project was generated with [slush-globeapp](https://github.com/BostonGlobe/slush-globeapp). Consult its [README](https://github.com/BostonGlobe/slush-globeapp) for more information.

Please note: do not reproduce Boston Globe logos or fonts without written permission.

## Setup
The app uses handlebars to precompile to HTML. All HTML should be be placed in **src/html/partials/graphic/graphic.hbs**.

#### Copy
Using a shared google doc for all copy is recommended. The app uses [ArchieML](http://archieml.org) as a micro CMS.

*Setup google doc*
- Create a google doc (outside of Globe domain)
- Publish to web: file -> publish to web
- Make public: share button -> advanced -> change "private only you can access" to "public on the web"
- In the address bar, grab the ID
	- ...com/document/d/ **1IiA5a5iCjbjOYvZVgPcjGzMy5PyfCzpPF-LnQdCdFI0** /edit
- In **copy.js** paste in the ID

*Run archie*
- To get the latest copy, run `node copy.js` in root
- This will update **src/data/copy.json** which is handlebars pulls from

If the data is too sensitive or a google doc is overkill, you can update **src/data/copy.json** directly. The following snippet is a bare minimum needed to fill out the basic information for seo and analytics:

```
{
	"title": "Graphic title",
	"description": "Description of graphic",
	"keywords": "Comma, delimited, for, seo",
	"url": "https://apps.bostonglobe.com/graphics/path/to/graphic",
	"image_url": "https://apps.bostonglobe.com/graphics/path/to/image",
	"page_id": "apps.mmddyy.title-no-spaces",
	"section": "Metro",
	"chartbeat_section": "metro",
	"header_color": "",
	"credits": [{
		"role": "Development",
		"name": "Russell Goldenberg"
	}, {
		"role": "Design",
		"name": "Elaina Natario"
	}]
}
```

## Deploy
#### Step 1: gulp 
Run `gulp prod` to deploy. Outputs files into `dist/prod` folder in root.

#### Step 2: put project files on server
- Create project directory on server. On a Mac, Finder -> Go -> Connect to Server.
- Enter `smb://widget.boston.com/web/bgapps/html` (username globe\first.last and password).
- Navigate to graphics/[year]/[month] and create a folder for your project (ex. graphics/2015/01/football-homerun).
- Copy over your all the files in the **prod** folder to the server.
- Your project is now internally visible at http://dev.apps.bostonglobe.com/graphics/[year]/[month]/[project-name].
- Update these files whenever you want.

#### Step 3: publish assets
- In Terminal, connect to shell (your username is usually first initial last name): `ssh rgoldenberg@shell.boston.com`.
- Navigate to your project directory: `cd /web/bgapps/html/graphics/[year]/[month]/[project-name]`.
- Run the command `upload *` in the root **and** each subdirectroy. (ex. `cd css`, then `upload *` to upload all files in that folder).

### Public url
- **https**://apps.bostonglobe.com/graphics/[year]/[month]/[project-name]