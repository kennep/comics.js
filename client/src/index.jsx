import * as React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types'
import * as jquery from 'jquery';

import 'bootstrap/dist/css/bootstrap.min.css';

var gapi = window.gapi;

class ComicList extends React.Component {

constructor(props) {
	super(props)
	this.state = {
			comics: [],
			error: null,
            user: null,
            gapiLoaded: false
		};
	}

	componentDidMount() {
        gapi.load('auth2', this.onAuth2Loaded.bind(this))
  }

  onAuth2Loaded() {
        this.auth = gapi.auth2.init({
           client_id: '442029269791-mft6hqfi8ofrl246lae5eo7bg6olt9oq.apps.googleusercontent.com'
        });
        this.auth.currentUser.listen(this.onUserChanged.bind(this));
		this.auth.then(() => {
            if(!this.auth.isSignedIn.get()) {
                this.setState({'user': null});
            }
            this.setState({'gapiLoaded': true});
        }, (error) => {
            this.setState({'error': error, 'gapiLoaded': true});
        })
	}

  onUserChanged(currentuser) {
        if(currentuser.isSignedIn()) {
            this.setState({'user': currentuser});
            var component = this;
            jquery.ajax("/api/comics", {
                headers: {
                    'Authorization': 'Bearer ' + currentuser.getAuthResponse().id_token
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    component.setState({error: jqXHR.responseText ? jqXHR.responseText : errorThrown});
                },
                success: (data, textStatus, jqXHR) => {
                    component.setState({error: null, comics: data});
                }
            });
        } else {
            this.setState({'user': null})
        }
  }

  signIn() {
        this.auth.signIn();
  }

	render() {
		if(this.state.comics.length == 0) {
            if(!this.state.gapiLoaded) {
                var style={'width': '100%'};
                return <div className="container-fluid"><div className="progress">
                        <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={style}>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div></div>
            } else if(this.state.user == null) {
               return <div className="container-fluid">Please <a href="#" onClick={this.signIn.bind(this)}>sign in</a> with your Google ID to use this application</div>
            } else if(this.state.error) {
              return <div className="container-fluid">{this.state.error}</div>;
            } else {
                var style={'width': '100%'};
                return <div className="container-fluid"><div className="progress">
                        <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={style}>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div></div>
            }
		}
		return <div className="container-fluid">{this.state.comics.map(function(comic) {
			return <Comic key={comic.name} comic={comic} />
		})}</div>
	}
}

class Comic extends React.Component {
	constructor(props) {
	  super(props)
		this.state = {zoomed: false, zoomed2: false};
	}

	handleClick(event) {
		this.setState({zoomed: !this.state.zoomed});
		event.preventDefault();
	}

	handleClick2(event) {
		this.setState({zoomed2: !this.state.zoomed2});
		event.preventDefault();
	}

	render() {
		var className="comic";
		if(this.state.zoomed) className += " zoomed";
		var img2;
		var error;
		if(this.props.comic.url2) {
			  var className2="comic";
			  if(this.state.zoomed2) className2 += " zoomed";
 		      img2 = <div className="comic-container">
		        <a href={this.props.comic.originalUrl} onClick={this.handleClick2.bind(this)}><img
				className={className2} src={this.props.comic.url2} /></a>
		      </div>
		}
		if(this.props.comic.error) {
			error = <div className="alert alert-danger" role="alert"><p>{this.props.comic.error}</p><p>{this.props.comic.errorInfo}</p></div>
		}
		return <div className="card mb-3">
			<div className="card-header"><h5><a
				href={this.props.comic.originalUrl}>{this.props.comic.name}</a></h5></div>
			<div className="card-body">
		{error}
 		      <div className="comic-container">
		        <a href="#" onClick={this.handleClick.bind(this)}><img
				className={className} src={this.props.comic.url} /></a>
		      </div>
		{img2}
  			  <div dangerouslySetInnerHTML={{__html: this.props.comic.title}} />
	  	    </div>
		</div>
	}
}
Comic.propTypes = {
		comic: PropTypes.object
}

render(<ComicList />, document.getElementById('content'));
