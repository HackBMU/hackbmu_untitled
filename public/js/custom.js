var chatbot_input = document.getElementById('input');
$('#button-chat').click(function() {
    $.ajax({
        type: 'POST',
        url: "http://10.7.2.96:3000/chatbot",
        data: {
            input: chatbot_input.value
        },
        dataType: "text",
        success: function(resultData) {
            console.log(resultData);
            document.getElementById('output').innerHTML = resultData.body.output;
            document.getElementById('url').innerHTML = resultData.body.url;
        }
    });
});