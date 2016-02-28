/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {render} from 'react-dom';
import * as jquery from 'jquery';

interface GoogleAuth {
    
};

interface Auth2 {
    init(params: any) : GoogleAuth
}

interface GAPI {
    auth2 : Auth2
    load(name : string, callback : any) : void
};

var gapi : GAPI = (window as any).gapi;

var ComicList = React.createClass({
	getInitialState: function() {
		return {
			comics: [],
			error: null,
            user: null
		};
	},
	
	componentDidMount: function() {
        gapi.load('auth2', this.onAuth2Loaded)
    },
    
    onAuth2Loaded: function() {
        this.auth = gapi.auth2.init({
           client_id: '442029269791-mft6hqfi8ofrl246lae5eo7bg6olt9oq.apps.googleusercontent.com' 
        });
        this.auth.currentUser.listen(this.onUserChanged);
			
	},
    
    onUserChanged: function(currentuser) {
        if(currentuser.isSignedIn()) {
            this.setState({'user': currentuser});
            var component = this;
            jquery.ajax("/api/comics", {
                headers: {
                    'Authorization': 'Bearer ' + currentuser.getAuthResponse().id_token
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    component.setState({error: textStatus + errorThrown});
                },
                success: (data, textStatus, jqXHR) => {
                    component.setState({error: null, comics: data});
                }
            });        
        } else {
            this.setState({'user': null})
            this.auth.signIn();
        }
    },
	
	render: function() {
		if(this.state.comics.length == 0) {
            if(this.state.user == null) {
               return <div className="container-fluid">Please sign in with your Google ID to use this application</div>           
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
});

interface ComicProps {
	key: string;
	comic: any;
}

var Comic = React.createClass<ComicProps, any>({
	propTypes: {
		key: React.PropTypes.string,
		comic: React.PropTypes.object
	},
	
	getInitialState: function() {
		return {zoomed: false, zoomed2: false};
	},
	
	handleClick: function(event) {
		this.setState({zoomed: !this.state.zoomed});
		event.preventDefault();
	},
	

	handleClick2: function(event) {
		this.setState({zoomed2: !this.state.zoomed2});
		event.preventDefault();
	},

	render: function() {
		var className="comic";
		if(this.state.zoomed) className += " zoomed";
		var img2;
		var error;
		if(this.props.comic.url2) {
			  var className2="comic";
			  if(this.state.zoomed2) className2 += " zoomed";
 		      img2 = <div className="comic-container">
		        <a href={this.props.comic.originalUrl} onClick={this.handleClick2}><img 
				className={className2} src={this.props.comic.url2} /></a>
		      </div>
		}
		if(this.props.comic.error) {
			error = <div className="alert alert-danger" role="alert"><p>{this.props.comic.error}</p><p>{this.props.comic.errorInfo}</p></div>
		}
		return <div className="panel panel-default">
			<div className="panel-heading"><h3 className="panel-title"><a 
				href={this.props.comic.originalUrl}>{this.props.comic.name}</a></h3></div>
			<div className="panel-body">
		{error}
 		      <div className="comic-container">
		        <a href="#" onClick={this.handleClick}><img 
				className={className} src={this.props.comic.url} /></a>
		      </div>
		{img2}
			  <div dangerouslySetInnerHTML={{__html: this.props.comic.title}} />
		    </div>
		</div>
	}
});

render(<ComicList />, document.getElementById('content'));
