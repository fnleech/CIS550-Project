setwd("/Users/francineleech/Github/CIS550-Project/OlympicData")
datrio = read.csv("events.csv", header = TRUE)
datbeg = read.csv("2008EVENTS.csv", header = F)

datbeg_final =unique(datbeg)

#Find what is in Bejing not in Rio
install.packages("data.table")
library(data.table)

DT1 <- data.table(datrio)
DT2 <- data.table(cbind(datbeg_final, 0), key=paste0("V", seq(len=ncol(datbeg_final))))
setnames(DT1, c(head(names(DT1), -1L), "found"))
DT2[DT1, list(found=ifelse(is.na(found), 0, 1))]

# Beijing found in Rio 

write.csv(datrio, file = "Sport.csv")
