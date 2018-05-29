#!/bin/sh

# register app
source mfpregisterapp.sh

mobilefoundationPassword=$(awk -F '[<>]' '/mobilefoundationPassword/{print $3}' $(pwd)/res/values/credentials.xml)
mobilefoundationUrl=$(awk -F '[<>]' '/mobilefoundationUrl/{print $3}' $(pwd)/res/values/credentials.xml)

conversationUsername=$(awk -F '[<>]' '/conversationUsername/{print $3}' $(pwd)/res/values/credentials.xml)
conversationPassword=$(awk -F '[<>]' '/conversationPassword/{print $3}' $(pwd)/res/values/credentials.xml)

OPERATION="Download Adapter"

HTTP_STATUS=$( curl -s -w '%{http_code}' -X GET -u admin:$mobilefoundationPassword -o WatsonConversation.adapter "https://git.ng.bluemix.net/imfsdkt/console-samples/raw/master/WatsonConversation.adapter" )


if [ "$HTTP_STATUS" == "200" ]
then
    echo "SUCCESS: $OPERATION"
    OPERATION="Deploy Adapter"
    HTTP_STATUS=$( curl -s -o /dev/null -w '%{http_code}' -X POST -u admin:$mobilefoundationPassword -F file=@WatsonConversation.adapter "$mobilefoundationUrl/mfpadmin/management-apis/2.0/runtimes/mfp/adapters" )
    echo "SUCCESS: $OPERATION"
else
  echo "FAILED: $OPERATION"
  echo $HTTP_STATUS
  exit 1
fi

if [ "$HTTP_STATUS" == "200" ]
then
    echo "SUCCESS: $OPERATION"
    OPERATION="Upload Adapter Configuration"
    adapterJsonPart1='{"adapter" : "WatsonConversation","properties" : {"username" :"'
    adapterJsonPart2='","password" :"'
    adapterJsonPart3='"'}}''
    adapterJson=$adapterJsonPart1$conversationUsername$adapterJsonPart2$conversationPassword$adapterJsonPart3
    HTTP_STATUS=$( curl -s -o /dev/null -w '%{http_code}' -u admin:$mobilefoundationPassword -H "Content-Type: application/json" -X PUT -d "$adapterJson" "$mobilefoundationUrl/mfpadmin/management-apis/2.0/runtimes/mfp/adapters/WatsonConversation/config" )
else
  echo "FAILED: $OPERATION"
  echo $HTTP_STATUS
  exit 1
fi

if [ "$HTTP_STATUS" == "200" ]
then
    echo "SUCCESS: $OPERATION"
else
  echo "FAILED: $OPERATION"
  echo $HTTP_STATUS
  exit 1
fi
