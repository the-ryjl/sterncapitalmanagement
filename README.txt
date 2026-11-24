STERN CAPITAL MANAGEMENT WEBSITE

Upload everything in this folder to the site's host, keeping the folders as they are:
  index.html            the whole site (Home, Portfolios, Events, Team, Join)
  logos/                firm logos for the "Speakers, members and alumni come from" wall
  team/                 headshots (see team/README.txt)
  about.html, team.html, events.html, ...   forwarders so old links land on the right section

The old site is plain HTML pages, so the same host or GitHub Pages both work.
The research.sterncapitalmanagement.org subdomain is separate; point it at the
new site or retire it in the domain's DNS settings.

LIVE PORTFOLIO DATA
The Portfolios page and the homepage card read the "SCM Tech Pod Book" Google Sheet
(File > Share > Publish to web, entire document, CSV). Keep it published.
Prices refresh about every 20 minutes during market hours; the page re-checks every 60 seconds.
If Google's published copy is still recalculating, the page keeps the last good numbers
instead of showing blanks. The live feed only works on the real website, not in previews.

EDITING (all in index.html, near the top of the script)
Team: EXEC, PMS, ADVISORS lists. Photos: team/first-last.jpg (e.g. team/stacy-dinh.jpg);
  anyone without a photo shows initials. Square headshots, 300px or bigger.
  The Team grid is laid out for 6 board members, 1 PM and 4 advisors; if those counts
  change, the bottom row's column slots need adjusting (comment in the CSS says where).
Events: the EVENTS list (newest first). A future-dated event shows under Upcoming.
Meetings: MEETING_OFF lists break weeks with no Monday meeting. Update each year.
Firm logos: add a PNG to logos/ and its slug to LOGO_FILES.
