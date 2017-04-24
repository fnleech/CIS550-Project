setwd("/Users/francineleech/Github/CIS550-Project/OlympicData")

IOC = read.csv("FinalCountryCode.csv", header = F)
names(IOC) = c("code", "name")

air = read.csv("air.csv", header = F)
names(air) = c("name", "PM10", "PM2.5")
country = read.csv("countryraw.csv", header = F)
names(country) = c("name", "population", "GDP", "continent")

setdiff(IOC[,2], country[,1])

country1 = merge.data.frame(IOC, country, by.x = "name", by.y = "name", all.x = TRUE)

country2 = merge.data.frame(IOC, air, by.x = "name", by.y = "name", all.x = TRUE)

finalcountry = merge.data.frame(country1, country2, by.x = "code", by.y= "code")
finalcountry = finalcountry[,c(-6)]
names(finalcountry) = c("code", "name", "population", "GDP", "Continent", "PM10", "PM2.5")

write.csv(finalcountry, "Country.csv")
