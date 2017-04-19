setwd("/Users/francineleech/Github/CIS550-Project/OlympicData")
datraw = read.csv("Eventraw.csv", header = TRUE)
datfinal =datraw[duplicated(datraw),]
write.csv(datfinal, file = "EventFinal.csv")
