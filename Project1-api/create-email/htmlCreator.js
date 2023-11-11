
module.exports = (type, username, link) => {
    if(type === 'verify') {
        return (`
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title></title>
                    <style>

                        body {
                            margin: 0;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                sans-serif;
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                        }

                        a {
                            text-decoration: none;
                            color: black;
                            font-size: 20px;
                        }

                        a:visited {
                            color: black;
                        }

                        a div {
                            width: max-content;
                            height: max-content;
                            padding: 10px;
                            background-color: rgb(205, 240, 135);
                            margin: auto;
                            margin-top: 20px;
                            color: black;
                        }

                        a div:hover {
                            background-color: rgb(175, 210, 105);
                            cursor: pointer;
                        }

                    </style>
                </head>
                <body>
                    <div style=" box-sizing: border-box; text-align: center; margin: auto; padding: 20px; background-color: rgb(250, 250, 250);">
                        <h3 style="text-align: center;">WELCOME TO PROJECT 1</h3>
                        <div>Thanks to signing up! We just need you to verify your email address to complete setting up your account </div>
                        <a href=${link}><div role="button">Verify My Email</div></a>
                    </div>
                </body>
            </html>      
        </>`)
    } else if(type === 'reset') {
        return (`
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title></title>
                    <style>

                        body {
                            margin: 0;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                sans-serif;
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                        }

                        a {
                            text-decoration: none;
                            color: black;
                            font-size: 20px;
                        }

                        a:visited {
                            color: black;
                        }

                        a div {
                            width: max-content;
                            height: max-content;
                            padding: 10px;
                            background-color: rgb(205, 240, 135);
                            margin: auto;
                            margin-top: 20px;
                            color: black;
                        }

                        a div:hover {
                            background-color: rgb(175, 210, 105);
                            cursor: pointer;
                        }

                    </style>
                </head>
                <body>
                    <div style=" box-sizing: border-box; text-align: center; margin: auto; padding: 20px; background-color: rgb(250, 250, 250);">
                        <h3 style="text-align: center;">Hi ${username}, </h3>
                        <div> We are sending you this email because you requested a password reset. Click on this link to create a new password </div>
                        <a href=${link}><div role="button">Set a new password</div></a>
                    </div>
                </body>
            </html>      
        </>`)
    }
}