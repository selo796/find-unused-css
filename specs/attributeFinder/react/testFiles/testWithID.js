'use strict';
var TopicNav = React.createClass({
render: function() {
return (
    <div id="my-id1">
        <div>
            <div>
                <button type="button" data-toggle="dropdown" aria-expanded="false">
                  Bulk Actions <span ></span>
                </button>
                <ul role="menu">
                  <li><a href="#">Merge into New Session</a></li>
                  <li><a href="#">Add to Existing Session</a></li>
                  <li className="divider" id="my-id2"></li>
                  <li><a href="#">Delete</a></li>
                </ul>
            </div>
        </div>
    </div>
);
}});