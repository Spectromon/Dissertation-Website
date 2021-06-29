function loginUser(){
    var u_name = document.getElementById("username").value
    var p_word = document.getElementById("password").value
    const sqldata = { Username : u_name, Password: p_word}
        const options = {
            method: 'POST',
            headers: {
                        'Content-Type': 'application/json',
                    },
            body: JSON.stringify(sqldata)
        };
        console.log(sqldata)  
fetch ("/login", options)
.then((response) => response.json())
.then((data) => {
    data.forEach(function(logger){
        console.log(`${logger.u_name} and ${logger.p_word}`)
    })
    }
)
}
