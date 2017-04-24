setwd("/Users/francineleech/Github/CIS550-Project/OlympicData/FinalData")
sport = read.csv("Sport.csv", header = F)
names(sport) = c("sport", "discipline", "event", "gender")
sportuni=unique(sport)
