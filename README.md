## Installing

### Before You Begin

1. Make sure you have installed [Node.js](https://nodejs.org/en/) (you will need **at least v15.0.0**) and [Git](https://git-scm.com/).
	- If on Windows, [make sure to check the box in the section of the installer for "Tools for Native Modules"](https://i.imgur.com/RMrlz2S.png).
2. Clone this repository with `git clone https://github.com/dragonfire535/xiao.git`.
3. Run `cd xiao` to move into the folder that you just created.
4. Create a file named `.env` and fill it out as shown in `.env.example`.

### Windows

1. [Follow these instructions to install the dependencies for `node-canvas`](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows).
2. [Follow these instructions to install ffmpeg](https://www.wikihow.com/Install-FFmpeg-on-Windows).
3. [Install ImageMagick](https://imagemagick.org/script/download.php).
4. [Follow these instructions to install Redis](https://riptutorial.com/redis/example/29962/installing-and-running-redis-server-on-windows). Remember to set up a password!
5. Download [the NSFW model](https://github.com/gantman/nsfw_model) and extract the contents to `<xiao folder>/tf_models/nsfw`.
6. Run `npm i --production` in the folder you cloned the bot.
7. Run `npm i -g pm2` to install PM2.
8. Run `pm2 start Xiao.js --name xiao` to run the bot.

### Mac

1. Use a real (cheaper!) OS to host your bot.
2. ???
3. Profit.

### Ubuntu and other Debian-based systems

1. Run `apt update`.
2. Run `apt upgrade` to install the latest dependencies of your distro.
3. Run `apt install python` to install python.
4. Run `apt install ffmpeg` to install ffmpeg.
5. [Follow these instructions to install the dependencies for `node-canvas`](https://github.com/Automattic/node-canvas/wiki/Installation%3A-Ubuntu-and-other-Debian-based-systems).
6. Run `apt install liblqr-1-0-dev liblqr-1-0` to install liblqr (needed for ImageMagick).
7. [Follow these instructions to install ImageMagick](https://www.tecmint.com/install-imagemagick-on-debian-ubuntu/).
8. [Follow these instructions to set up Redis](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04). Remember to set up a password!
9. Run `apt install libtool` so sodium can compile if necessary. **(Optional)**
10. Download [the NSFW model](https://github.com/gantman/nsfw_model) and extract the contents to `<xiao folder>/tf_models/nsfw`.
11. Run `npm i --production` in the folder you cloned the bot.
12. Run `npm i -g pm2` to install PM2.
13. Run `pm2 start Xiao.js --name xiao` to run the bot.
