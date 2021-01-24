import React, {useState} from 'react'
import { PDFDocument } from 'pdf-lib'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import { degrees, rgb, StandardFonts } from 'pdf-lib';

import "../Styles.css"

const Main = () => {


    const [text, setText] = useState("")


    const [file, setFile] = useState('');
    const [template, setTemplate] = useState('');


    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const showFile = (e) => {
        const myFile = e.target.files[0];

        console.log(myFile);

        
    }

    console.log(template);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const createPDF = async () => {
        const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
        const existingPdfBytes = await fetch(url).
        then(res => res.arrayBuffer())

        
            
        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
            
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        const { width, height } = firstPage.getSize()
        firstPage.drawText(`${text}`, {
          x: 20,
          y: height / 2 + 300,
          size: 50,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
        })
    
        const pdfBytes = await pdfDoc.saveAsBase64({dataUri: true});

        setFile(pdfBytes);
    }



    return (
        <div className="container">
            <div className="input-field">
                <div className="input-box">
                    <input placeholder="Enter title" value={text}
                    onChange={(e) => setText(e.target.value)}></input>
                </div>
                <div className="input-box">
                    <textarea rows="20" cols="10" placeholder="Enter content"></textarea>
                </div>
                <input type="file" accept=".pdf" onChange={(e) => showFile(e)}></input>
                <div className="submit-btn">
                    <button onClick={() => createPDF()}>
                        Create PDF
                    </button>
                </div>
                
            </div>


            <div className="preview-container">
                <Document file={file}
                    onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} />
                </Document>
            </div>
        </div>
    )
}

export default Main
