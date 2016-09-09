'use strict';
var TopicNav = React.createClass({
render: function() {
return (
    <div className="row">
        <div className="col-lg-6">
            <div className="btn-group pull-right {this.props.showBulkActions ? 'show' : 'hidden'}">
                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  Bulk Actions <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" role="menu">
                  <li><a href="#">Merge into New Session</a></li>
                  <li><a href="#">Add to Existing Session</a></li>
                  <li className="divider"></li>
                  <li><a href="#">Delete</a></li>
                </ul>
            </div>
        </div>
    </div>
);
}});