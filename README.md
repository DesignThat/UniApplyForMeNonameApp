# UniApplyForMeNonameApp

UniApplyForMeNonameApp is a web application that allows users to upload and view HTML files. The application validates the uploaded files to ensure they are valid HTML documents.

## Features

- **File Upload**: Users can upload HTML files.
- **File Validation**: The app checks if the uploaded file is a valid HTML document.
- **File Viewing**: Users can view the content of the uploaded HTML file.
- **Error Handling**: Displays error messages if the uploaded file is not valid or if there are issues reading the file.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/DesignThat/UniApplyForMeNonameApp.git
    ```
2. Navigate to the project directory:
    ```sh
    cd UniApplyForMeNonameApp
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the development server:
    ```sh
    npm run dev
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

- `src/`
  - `App.tsx`: Main application component.
  - `components/`
    - `FileUploader.tsx`: Component for uploading files.
    - `FileViewer.tsx`: Component for viewing uploaded files.
  - `main.tsx`: Entry point of the application.
  - `index.css`: Global styles.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run lint`: Run ESLint to lint the code.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Credits

This application is powered by [UniApplyForMe](https://apply.org.za). The "Powered by" text and URLs in the application cannot be removed as they credit the developer.