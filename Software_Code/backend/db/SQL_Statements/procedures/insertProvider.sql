CREATE DEFINER=`root`@`%` PROCEDURE `insertProvider`(new_providerID INT, new_providerName VARCHAR(45), new_providerStreetAdd VARCHAR(45), new_providerCity VARCHAR(45), new_providerState VARCHAR(45), new_providerZip VARCHAR(45), new_providerreferral VARCHAR(45), new_providerLatitude DECIMAL(15,10), new_providerLongitude DECIMAL(15,10))
BEGIN
	INSERT INTO provider (provider_ID, provider_Name, provider_StreetAdd, provider_City, provider_State, provider_Zip, provider_referral) VALUES (new_providerID, new_providerName, new_providerStreetAdd, new_providerCity, new_providerState, new_providerZip, new_providerreferral, new_providerLatitude, new_providerLongitude);
END