module.exports = {


  friendlyName: 'Template',


  description: 'Use this helper if you need to generate a template for the Effect Network',


  inputs: {

    data: {
      type: ['ref'],
      example: [
        {
          name: 'Names',
          color: '#FFC900',
        },
        {
          name: 'Lastnames',
          color: '#00B68F',
        },
        {
          name: 'Document ID',
          color: '#3C138E',
        },
      ],
      description: 'Effect Network Private Key',
      required: true,
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

    issues: {
      description: 'Error',
    },

  },


  fn: async function (inputs, exits) {
    try {

      function parsename(name) {

        name = name.toLowerCase();
        name = name.replace(/\s+/g, '_');

        return name;
      }

      const data = inputs.data;
      
      var inputs = ''
      
      data.forEach(item => {
        var input = `<div class="row"> <div class="col-sm-11"> <h5>${item.name}</h5> <div class="color" style="background-color: ${item.color}"></div> <input name="${parsename(item.name)}" type="text" class="form-control" aria-label="Small" placeholder="${item.name}"> </div> </div>`

        inputs += input
      });

      var template = `<style>

      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap');
    
      .main-body {
        background-color: #FFFFFF;
        padding-top: 50px;
        padding-bottom: 100px;
      }
    
      .logo {
        max-width: 100px;
      }
    
      h4 {
        font-family: 'Poppins', sans-serif;
        color: #2C1361;
        font-size: 22px !important;
        padding-top: 40px;
      }
    
      .description {
        color: #ABA1C0;
      }
    
      .img-fluid {
        margin-top: 20px;
      }
    
      .instructions {
        font-size: 16px;
        margin-top: 17px !important;
        padding-left: 50px;
        font-weight: 500;
        color: #2C1361;
      }
    
      .icon-ins {
        position: absolute;
        max-width: 40px;
        margin-top: 15px;
      }
    
      .inputs {
        margin-top: 22px;
      }
    
      .color {
        width: 40px;
        height: 40px;
        background-color: #F4F6F9;
        position: absolute;
      }
    
      .form-control {
        margin-left: 50px;
        height: 40px;
        background-color: #F4F6F9 !important;
        border-radius: 0px !important;
        border-color: #F4F6F9 !important;
        color: #2C1361 !important;
        margin-bottom: 24px;
      }
    
      h5 {
        color: #2C1361;
        font-size: 16px !important;
        font-weight: 400 !important;
      }
    
      .form-check-label {
        color: #2C1361;
        font-size: 16px !important;
        font-weight: 400 !important;
        margin-left: 15px !important;
      }
    
      .made-with-love {
        font-size: 14px;
        color: #ABA1C0;
        margin-top: 40px;
      }
    
      .made-with-love b{
        color: #3C138E;
      }
    
      .mainbtn {
        float: right;
        margin-top: -47px;
        border-radius: 0px !important;
        padding: 10px 26px !important;
        background-color: #3C138E !important;
        border-color: #3C138E !important;
      }
    
    </style>
    
    <main>
      <div class="container">
        <div class="row">
          <div class="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-xs-8 offset-xs-2">
            <div class="main-body">
              <img class="logo" src="https://res.cloudinary.com/gettechnologies/image/upload/v1640231759/delos/delos_logo_lnj6jd.png" alt="delos_logo">
              <div class="row">
                <div class="col-sm-12">
                  <h4>Image labeling tasks</h4>
                  <p class="description">Type the text from the rectangle inside the text input with the same color.</p>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <img src='` + '${image_url}' + `' class="img-fluid" alt="Responsive image">
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <img class="icon-ins" src="https://res.cloudinary.com/gettechnologies/image/upload/v1640232715/delos/feedback_black_24dp_ogzohl.png" class="img-fluid" alt="Responsive image">
                  <p class="instructions">Please, check the instructions to see which information you need to type.</p>
                </div>
              </div>
    
              <div class="inputs">
                
                <!-- Inputs -->
                ${inputs}
                <!-- Inputs -->
    
                <div class="row">
                  <div class="col-sm-6" style="padding-top: 15px;">
                    <input class="form-check-input" type="checkbox" value="true" name="unrecognizable" id="flexCheckDefault">
                    <label class="form-check-label" for="flexCheckDefault">
                      Unrecognizable Image
                    </label>
                  </div>
                </div>
    
                <div class="row">
                  <div class="col-sm-12">
                    <p class="made-with-love">Made with ❤️ in <b>El Salvador</b>.</p>
                    <button class="btn btn-primary mainbtn" type="submit">Submit Task</button>
                  </div>
                </div>
    
              </div>
    
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- CSS only -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <!-- JavaScript Bundle with Popper -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>`;

      return exits.success(template);

    } catch (error) {
      return exits.issues(error);
    }
  }


};

