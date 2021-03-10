 makeFetchRequest(options, endPoint) {
    var newRespMessage;
    const handle = uuid();
    const url = "https://squid-fortress-staging.eleostech.com/api/" + endPoint;
    var date = new Date();
    var time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-`;
    // add message sent to the response list
    this.setState({ responseMessages: this.state.responseMessages.concat([`${time}Request Sent at ${url}`]) });
    fetch(url, options).then((response) => {
      if (response.OK) {
        localStorage.setItem('clientKey', this.state.clientKey);
      }
      time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-`;
      // add the response message to the response list
      newRespMessage = `${time}Response: ${response.status}(${response.statusText})`;
      this.setState({ responseMessages: this.state.responseMessages.concat([newRespMessage]) });
    });
  }

  makeMessageRequest(data) {
    var numRequests = 1;
    if (data["alert"] == false) {
      delete data.sound;
    }
    if (data["numRequests"] != null) {
      var numRequests = data["numRequests"];
      delete data.numRequests;
    }
    if (data["message_type"] == null) {
      data["message_type"] = "text";
    }
    if (data["direction"] == null) {
      data["direction"] = "outbound";
    }
    if (data["body"] == null) {
      data["body"] = "test";
    }
    if (this.state.clientKey == null || this.state.clientKey.length == 0) {
      alert("Please enter a client key");
    }
    else {

      console.log(data);
      const options = {
        method : 'PUT',
        headers : {
          "Authorization" : `Key key=${this.state.clientKey}`,
          "Content-Type" : "application/x-www-form-url-encoded;charset=UTF-8"
        },
        body: encodeFormData(data)
      };
      for (var i = 0; i < numRequests; i++) {
        const handle = uuid();
        this.makeFetchRequest(options, "v1/messages/" + handle);
      }
    }
  }