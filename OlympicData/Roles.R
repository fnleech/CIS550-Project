setwd("/Users/francineleech/Github/CIS550-Project/OlympicData")
raw = read.csv("RoleRaw.csv", header =T)

#rename headers
names(raw) <- c("City", "Edition", "Sport", "Disicipline", "Athlete", "NOC", "Gender", "Event", "Event_Gender", "Medal")
raww = raw[-1,]

#year > = 1960 
raww[,2] =as.numeric(as.character(raww$Edition))
datuse <- subset(raww, Edition >= 1960, select = c(Edition,NOC))

#get distinct rows
datdist = unique(datuse)

#now add column for role or participant
datdist$role = NA

datdist = datdist[,c(2,1,3)]

#renmae headers
names(datdist) = c("country", "year", "role")

Year = c(1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016)
Host = c("ITA", "JPN","MEX","GER","CAN", "RUS", "USA","KOR", "ESP", "USA", "AUS", "GRE", "CHN", "GBR", "BRA")
host = cbind.data.frame(Year, Host)
host[,2] = as.character(host[,2])
#Rio data
rio = read.csv("rioathletes.csv", header = T)
rio_country = unique(subset(rio, select = nationality))
rio_country$year = as.numeric(2016)
rio_country$role = NA
names(rio_country) = c("country", "year", "role")

#London data
london = read.csv("2012Countries.csv", header =F)
names(london) = c("Name", "Age", "Height", "Weight")
lon_country = unique(subset(london, select = Name))
lon_country$year = as.numeric(2012)
lon_country$role = NA
names(lon_country) = c("name", "year", "role")

IOC = read.csv("FinalCountryCode.csv", header = F)
names(IOC) = c("code", "name")
#get country codes for london 

ioc = subset(IOC, select = name)
ioc$name = as.character(ioc$name)
lon = subset(lon_country, select = name)
lon$name = as.character(lon$name)

x <- rbind(ioc, lon)
x[! duplicated(x, fromLast=TRUE) & seq(nrow(x)) <= nrow(lon), ]
setdiff(lon[,1], ioc[,1])

#list countries did not participate, and England, UK, Scotland combined as Great Britain

mergefinal = merge.data.frame(IOC, lon_country, by = "name")

lonfinal = subset(mergefinal, select= c(code, year))
lonfinal$role = NA
names(lonfinal)= c("country", "year", "role")


## Final Roles
roles = rbind.data.frame(rio_country, lonfinal, datdist)

finalroles = data.frame(country = as.character(),
                        year = as.numeric(), 
                        role = as.character())

for (i in 1:nrow(host)) {
   rowsuse=roles[roles[,2] == host[i,1],]
   for(j in 1:nrow(rowsuse)) {
     if (rowsuse[j,1] == host[i,2]) {
       rowsuse[j,3] = "both"
     } else {
       rowsuse[j,3] = "participant"
     }} 
   finalroles = rbind.data.frame(rowsuse, finalroles)
}






