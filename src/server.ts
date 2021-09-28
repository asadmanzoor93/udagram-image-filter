import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Filter Image Endpoint: Pass image as query param to get the filtered image as a response
  app.get( "/filteredimage", async ( request, response ) => {
    let image_url: string = request.query.image_url;
    if( !image_url ) {
      return response.status(400).send(`Unprocessable Entity: Image URL Required`);

    } else {
      try{
        let filtered_image = await filterImageFromURL(image_url)
        response.status(200).sendFile(filtered_image, (error) => {
          if(error){
            console.log('Error Serving Filtered Image')
          }
          else{
            deleteLocalFiles([filtered_image])
          }
        })
      }
      catch (e){
        response.status(400).send('Image Processing Failed')
      }
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
