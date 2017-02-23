#install ggplot2
install.packages("ggplot2")
library(ggplot2)


#SummarySE Function
## Summarizes data.
## Gives count, mean, standard deviation, standard error of the mean, and confidence 
## interval (default 95%).
##   data: a data frame.
##   measurevar: the name of a column that contains the variable to be summariezed
##   groupvars: a vector containing names of columns that contain grouping variables
##   na.rm: a boolean that indicates whether to ignore NA's
##   conf.interval: the percent range of the confidence interval (default is 95%)
summarySE <- function(data=NULL, measurevar, groupvars=NULL, na.rm=FALSE, conf.interval=.95) {
  library(doBy)
  
  # New version of length which can handle NA's: if na.rm==T, don't count them
  length2 <- function (x, na.rm=FALSE) {
    if (na.rm) sum(!is.na(x))
    else       length(x)
  }
  
  # Collapse the data
  formula <- as.formula(paste(measurevar, paste(groupvars, collapse=" + "), sep=" ~ "))
  datac <- summaryBy(formula, data=data, FUN=c(length2,mean,sd), na.rm=na.rm)
  
  # Rename columns
  names(datac)[ names(datac) == paste(measurevar, ".mean",    sep="") ] <- measurevar
  names(datac)[ names(datac) == paste(measurevar, ".sd",      sep="") ] <- "sd"
  names(datac)[ names(datac) == paste(measurevar, ".length2", sep="") ] <- "N"
  
  datac$se <- datac$sd / sqrt(datac$N)  # Calculate standard error of the mean
  
  # Confidence interval multiplier for standard error
  # Calculate t-statistic for confidence interval: 
  # e.g., if conf.interval is .95, use .975 (above/below), and use df=N-1
  ciMult <- qt(conf.interval/2 + .5, datac$N-1)
  datac$ci <- datac$se * ciMult
  
  return(datac)
}
install.packages("doBy")
library(doBy)

#Download US data
file_names <- dir("/Users/francineleech/GitHub/CIS550-Project/Leech_EDA/dat") #where you have your files
dat <- do.call(rbind,lapply(file_names,read.csv))


#Local Cases - count of cases locally 
dat.local = dat[which(dat$data_field_code == "US0002"),]
local.sum =summarySE(dat.local, measurevar="value", groupvars=c("location"), na.rm = T)
ggplot(local.sum, aes(x=location, y=value)) + 
  geom_bar(stat="identity") + theme(axis.text.x = element_text(angle = 90, hjust = 1))


#Travel Cases - count of cases from travel
dat.travel= dat[which(dat$data_field_code == "US0001"),]
travel.sum =summarySE(dat.travel, measurevar="value", groupvars=c("location"), na.rm = T)
ggplot(travel.sum, aes(x=location, y=value)) + 
  geom_bar(stat="identity") + theme(axis.text.x = element_text(angle = 90, hjust = 1))



