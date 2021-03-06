//Get full url from server
var url = window.location.href;
//Get host from server
var host = url.split('/')[0]+url.split('/')[1]+'//'+url.split('/')[2]
var AppUrl = host; 
var pathAPI = '/api/v1/services';
var pathImages = '/api/v1/images';
var APIUrl = AppUrl+pathAPI;
var APIImagesUrl = AppUrl+pathImages


//Execute retrieve() and retrieveImages() after load document
$( document ).ready(function() {
    retrieve();
    retrieveImages()
});


//Get all registers From API
async function retrieve(){

    await $.getJSON(APIUrl, function(data) {

        data = data.data

        let dataGrid = '';

        //Foreach loop do generate HTML data grid
        data = typeof data == 'string' ? JSON.parse(data) : data;
        data.forEach(function(element) {

            let service_id =  element.attributes.service_id;
            let title =  element.attributes.title;
            let price =  Number(element.attributes.price).toFixed(2);
            let image =  element.attributes.image;
            let updated =  element.attributes.updated;

            //Default image if image not selected
            if(image == ''){
                image = 'https://sindilojas-sp.org.br/wp-content/themes/sindilojas/assets/images/default.jpg';
            }

            //Generate HTML data grid
            dataGrid += `

                <div class="col-md-4" id="service_`+service_id+`" style="overflow:hidden;">
                    <div class="card mb-4 shadow-sm">
                        
                        <img src="`+image+`?updated=`+updated+`" style="width:100%;height:auto;">
                            
                        <div class="card-body">
                            <h4 class="card-text">`+title+`</h4>
                            <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <a href="#mainForm" type="button" onclick="retrieveOne(`+service_id+`)" class="btn btn-sm btn-outline-secondary">Edit</a>
                                <button type="button" onclick="deleteOne('`+title+`', `+service_id+`)" class="btn btn-sm btn-outline-secondary">Delete</button>
                            </div>
                            <small>Price: <b>$`+price+`</b></small>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        
        })

        dataGrid = dataGrid.replace("[object HTMLDivElement]", "");
        $('#dataList').html(dataGrid);
    })

}


//Get one register by id from API
async function retrieveOne(id){

    //Clear all fields and messages
    clearAll();

    await $.getJSON(APIUrl+'/'+id, function(data) {

        data = data.data[0];

        element = typeof data == 'string' ? JSON.parse(data) : data;

        let service_id =  element.attributes.service_id;
        let title =  element.attributes.title;
        let price =  element.attributes.price;
        let image =  element.attributes.image;

        //Fill inputs with registered data
        $('#service_id').html('Service ID: '+service_id);
        $("#title").val(title);
        $("#price").val(price);
        $("#image").val(image);

        //Generate update button
        $("#saveBtn").attr("onclick","save("+id+")");

    })

}


//Send register data to API or update register data
async function save(id){

    //Send data massage
    $('#message').html('sending..');

    let method = '';
    let api_url = ''

    //Catch input values
    let service = {
        title: $("#title").val(),
        price: $("#price").val(),
        image: $("#image").val()
    }

    //Define method and API url if create new register
    if(id == undefined){
        method = 'post';
        api_url = APIUrl;
    }
    //Define method and API url if update register
    else{
        method = 'put';
        api_url = APIUrl+'/'+id;
    }

    await $.ajax({
        url: api_url,
        type: method,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(service),
        success: function (data) {

            $('#message').html(data.message);
   
            if(data.message.includes('service successfully created')){
                retrieve();
            }
            else if(data.message.includes('service successfully updated')){
                retrieve();
            }


        },
        error: function(request, message, error) {
            $('#message').html('Error to save data');
        }
    });    
    
    

}





//Delete one register from API
async function deleteOne(title, id){

    if(confirm("Remove service "+title+ " ?")){

        await $.ajax({
            url: APIUrl+'/'+id,
            type: 'delete',
            dataType: 'json',
            contentType: 'application/json',
            data: '',
            success: function (data) {
                
                if(data.message.includes('was deleted')){
                    $('#service_'+id).remove();
                }
                else{
                    alert(data.message); 
                }

            },
            error: function(request, message, error) {
                alert('Error to delete data');
            }
        }); 

    }

}





//Upload image to API
async function uploadImage(){

    $('#message').html('uploading image..');

    //Send image to API in formData format
    let formData = new FormData();           
    formData.append('image', $('#imageFile').prop('files')[0]);  

    await $.ajax({
        url: APIImagesUrl,
        type: 'post',
        data: formData,
        mimeType: "multipart/form-data",
        contentType: false,
        processData:false,
        success: function (data) {

            retrieveImages()
            $('#message').html('');
            $('#imageFile').val('');
            

        },
        error: function(request, message, error) {
            $('#message').html('Error to upload image');
        }
    });    
    
    

}




//Get image from API
async function retrieveImages(){

    let images = '';

    await $.getJSON(APIImagesUrl, function(data) {


        for(let i = 0; i < data.length; i++){

            imagePath = data[i];

            parts = imagePath.split('/');
            imageName = parts[parts.length - 1];

            //Generate images div contentor
            images += `
            <div class="boxImagesInLibrary">
                <img class="imagesInLibrary" src="`+imagePath+`" onclick="defineImage('`+imagePath+`')">
                <a href="javascript:void(0);" onclick="deleteImage('`+imageName+`')">Delete</a>
            </div>
            `
        }

        $('#showImages').html(images);

        $(".imagesInLibrary").click(function() {
            $(".imagesInLibrary").css('border', '0px');
            $(this).css('border', '3px solid red');
        });

    })

}


//Get one image from API
async function defineImage(imagePath){
    $("#image").val('')
    $("#image").val(imagePath)
}



//Delete Image from API
async function deleteImage(imageName){


    if(confirm("Remove image "+imageName+ " ?")){

        await $.ajax({
            url: APIImagesUrl+'/'+imageName,
            type: 'delete',
            dataType: 'json',
            contentType: 'application/json',
            data: '',
            success: function (data) {    
                retrieveImages()
            },
            error: function(request, message, error) {
                alert('Error to delete data');
            }
        }); 

    }


}







//Clear fields and messages
function clearAll(){
    
    $('#service_id').html('');
    $("#title").val('');
    $("#price").val('');
    $("#image").val('');

    $("#saveBtn").attr("onclick","save()");

    $('#message').html('');

    $("#showImages").hide();
    $("#showInputUpload").hide();
    $('#imageFile').val('');

    
}


//Format to currency
$("input[data-type='currency']").on({
    keyup: function() {
      formatCurrency($(this));
    },
    blur: function() { 
      formatCurrency($(this), "blur");
    }
});


function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.
  
  // get input value
  var input_val = input.val();
  
  // don't validate empty input
  if (input_val === "") { return; }
  
  // original length
  var original_len = input_val.length;

  // initial caret position 
  var caret_pos = input.prop("selectionStart");
    
  // check for decimal
  if (input_val.indexOf(".") >= 0) {

    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);
    
    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "00";
    }
    
    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = "" + left_side + "." + right_side;

  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = "" + input_val;
    
    // final formatting
    if (blur === "blur") {
      input_val += ".00";
    }
  }
  
  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}



$(document).ready(function(){

    //Show or hide Images Library
    $("#showImageItems").click(function() {
        $("#showImages").toggle();
        $("#showInputUpload").toggle();
    });

});




