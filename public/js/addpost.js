// function postsImage(){
//     const caption = document.getElementById('caption').value;
//     let for_return = false;
//     data = {
//         email:localStorage.getItem('Email'),
//         password:localStorage.getItem('Password'),
//         username:localStorage.getItem('Username'),
//         // imagetopost:image.name,
//         caption:caption
//     }
//     console.log(data);
//     fetch("/upload_image",{
//         method : "POST",
//         headers:{ "content-type" : "multipart/form-data"},
//         headers:{"content-type": "application/json"},
//         body: JSON.stringify(data)
//     }).then(response => response.json())
//         .then(data =>{
//             if(data.success){
//                 toastr.success("Image Upload Successfully");
//                 for_return=true;
//                 setTimeout(() => window.location.reload(),2000);
//             }
//             else{
//                 toastr.error('Unpaid');
//                 for_return = false;
//             }
//         })
//         .catch(e => {
//             console.log("Error: ",e);
//         })
//     return for_return;
// }
function postImages(event){
    event.preventDefault();
    const form = document.getElementById('postForm');

    const formData = new FormData(form);

    fetch('/upload_image', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          toastr.success('Image uploaded successfully');
          setTimeout(() => window.location.reload(),1000);
        } else {
          toastr.error('Failed to upload image');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }