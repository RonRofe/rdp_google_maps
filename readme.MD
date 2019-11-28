# JavaScript Challenge: Google Maps API & Ramer Douglas Peucker algorithm

My great friend, a CTO in a startup company, suggested me to try a nice challenge:  
To learn [Google Maps](https://developers.google.com/maps/documentation/javascript/reference) API and allow users to draw an area on the map.  
"Surprisingly" I replied that I expected something much more complicated and Interesting.  

I used Google Maps API's Polyline interface and generate **huge number of points** to demonsrate the shape which the user marked.  
! And now the interesting thing came in: He asked me to allow users to edit their shapes with the points generated.  

Since the shape consists of many points, I needed to reduce the number of points, without destroying the shape too much.
And there [RDP (Ramer Douglas Packer)](https://www.youtube.com/watch?v=nSYw9GrakjY) algorithm got into the business.