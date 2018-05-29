#!/bin/sh

##############################################################################################
# Note:
# (1) Ensure BMSCredentials.plist has populated mobilefoundationUrl & mobilefoundationPassword
# (2) Ensure mobile foundation server (mobilefoundationUrl) is up and running
# (3) In case the bundleid is inputted while running this script, then the app is
#     created/registered using the inputted bundleid.
##############################################################################################

keys=$(awk -F '[<>]' '/key/{print $3}' $(pwd)/$(find . -name BMSCredentials.plist))
keyArray=(${keys// / })
values=$(awk -F '[<>]' '/string/{print $3}' $(pwd)/$(find . -name BMSCredentials.plist))
valuesArray=(${values// / })

count=0;
for i in "${keyArray[@]}"
do
    if [ "$i" == "mobilefoundationPassword" ]
    then
        mobilefoundationPassword=${valuesArray[count]}
    elif [ "$i" == "mobilefoundationUrl" ]
    then
       mobilefoundationUrl=${valuesArray[count]}
    fi
    count=$((count+1))
done

# Automatically extract the bundleid from project.pbxproj file
package=$(grep "widget id=" $(pwd)/$(find . -name config.xml) | awk -F"\"" '{print $2}')

OPERATION="Register Application"

registerJson1='{"applicationKey": {"bundleId": "'
registerJson2='","version": "0.0.1","clientPlatform":"ios"},"mandatoryScope":"appAuthenticity","securityCheckConfigurations": {"appAuthenticity":{"expirationSec": "1200"}}}'

if [ "$1" == "" ]
then
  registerJson=$registerJson1$(echo $package)$registerJson2
else
  registerJson=$registerJson1$1$registerJson2
fi

HTTP_STATUS=$( curl -s -o /dev/null -w '%{http_code}' -X POST -u admin:$mobilefoundationPassword -H "Content-Type: application/json" -d "$registerJson" "$mobilefoundationUrl/mfpadmin/management-apis/2.0/runtimes/mfp/applications")


if [ "$HTTP_STATUS" == "200" ]
then
    echo "SUCCESS: $OPERATION"
else
  echo "FAILED: $OPERATION"
  echo $HTTP_STATUS
  exit 1
fi