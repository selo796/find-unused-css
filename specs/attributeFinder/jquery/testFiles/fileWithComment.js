/**
* hello.addClass($( "p" ).append("
*               <div class="noAddClass">Hello</div>
*                " );
*                $( "p:last" ).addClass( "noAddClass1" );)
*/

$( "p" ).append(`<strong class="selected secondClass">Hello</strong>`);
$( "p:last" ).addClass( "X Y");

// this is a test.addClass( "noAddClass2" );)