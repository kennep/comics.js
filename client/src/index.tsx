/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {render} from 'react-dom';
import * as jquery from 'jquery';

var ComicList = React.createClass({
	getInitialState: function() {
		return {
			comics: [],
			error: null
		};
	},
	
	componentDidMount: function() {
		var component = this;
		jquery.ajax("/api/comics", {
			error: (jqXHR, textStatus, errorThrown) => {
				component.setState({error: textStatus + errorThrown});
			},
			success: (data, textStatus, jqXHR) => {
				component.setState({error: null, comics: data});
			}
		});
			
	},
	
	render: function() {
		if(this.state.comics.length == 0) {
			var style={'width': '100%'};
			return <div className="container-fluid"><div className="progress">
  		  			<div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={style}>
    					<span className="sr-only">Loading...</span>
  		  			</div>
				   </div></div>
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
