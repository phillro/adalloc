Code Test From an interview
---------------------------
Problem is below. I tried to solve this using a bayesian classifier. Probably totally wrong and inacurrate, but I had fun so here it is.

Data for training set is in data/data.csv

Ad Optimization
---------------

We have 100 ads that we're going to be running next month.  We expect them to perform differently - they each target different and non-overlapping groups of users.

We have $10k to spend every hour for the next 500 hours.  Every ad will yield some number of clicks per dollar spent every hour, and some ads will perform better than others.  We want to allocate our budget such that we get the most clicks.

A couple notes:
You can only change the budget on an ad every hour
We want to spend all $10k every hour (no bonuses for coming in under budget)
Ads don't have a saturation point - if an ad gave you 100 clicks for $10, you can assume that it would give you 100k clicks for $10k.

Bonus points
None of these are necessary, but if you can get them you get some bonus points
 - Your code is object oriented
 - You've written tests