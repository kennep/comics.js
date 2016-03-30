FROM kennep/comics.js
MAINTAINER kenneth@wangpedersen.com

# Setup 
RUN mkdir /root/openshift
COPY publish.sh /root/openshift
RUN chmod 755 /root/openshift/publish.sh

ENTRYPOINT ["/root/openshift/publish.sh"]
