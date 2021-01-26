import React, {useState} from 'react'
import { PDFDocument } from 'pdf-lib'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import { degrees, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from '@progress/kendo-file-saver';
//https://www.telerik.com/kendo-react-ui/components/filesaver/

import "../Styles.css"

const Main = () => {


    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [org, setOrg] = useState("");
    const [content, setContent] = useState("");
    const [headname, setHeadName] = useState("");
    const [position, setPosition] = useState("");

    const [fileName, setFileName] = useState("");

    const [file, setFile] = useState('');
    const [template, setTemplate] = useState('');


    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    
    // Selecting template pdf -------------------

    const selectTemplate = (e) => {
        const myFile = e.target.files[0];

        // Getting the array bytes ofr the selected PDF file

        var reader = new FileReader();
        reader.readAsArrayBuffer(myFile);
        reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
               var arrayBuffer = evt.target.result,
                   array = new Uint8Array(arrayBuffer);
                setTemplate(array);
            }
        }
    }


    // Counting pages of pdf for React-pdf -------------------


    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }


    // Creating pdf with pdf-lib library-------------------

    const createPDF = async () => {


        if(type && org && name && content && headname && position){

            const pdfDoc = await PDFDocument.load(template)
        
            //Setting custom text in the PDF file

            const pages = pdfDoc.getPages()
            const firstPage = pages[0]
            const { width, height } = firstPage.getSize()

            const color = rgb(0, 0, 0);

            drawText(pdfDoc ,firstPage, 304, 520, color, type, 30);
            drawText(pdfDoc ,firstPage, 304, 400, color, org, 26);
            drawText(pdfDoc ,firstPage, 304, 330, color, name, 50);
            drawText(pdfDoc ,firstPage, 304, 280, color, content, 20);
            drawText(pdfDoc ,firstPage, 304, 100, color, headname, 22);
            drawText(pdfDoc ,firstPage, 540, 100, color, position, 22);
        
            const pdfBytes = await pdfDoc.saveAsBase64({dataUri: true});

            console.log(pdfBytes)

            setFile(pdfBytes);
        
        }
    }


    // Download PDF using kendo-file-saver

    const downloadPDF = () => {
        const dataURI = file;
        saveAs(dataURI, "test.pdf");
    }



    // Function for drawing text

    const drawText = async (pdf ,pageNum , X , Y, color, text, size) =>{

        const helveticaFont = await pdf.embedFont(StandardFonts.Helvetica)

        pageNum.drawText(`${text}`, {
            x: X,
            y: Y,
            size: size,
            font: helveticaFont,
            color: color,
        })
    }





    return (
        <div className="container">
            <div className="input-field">

                <div className="input-box">
                    <input placeholder="Enter certificate type" value={type}
                    onChange={(e) => setType(e.target.value)}
                    required></input>
                </div>

                <div className="input-box">
                    <input placeholder="Enter organozation name" value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    required></input>
                </div>

                <div className="input-box">
                    <input placeholder="Enter name" value={name}
                    onChange={(e) => setName(e.target.value)}
                    required></input>
                </div>
                <div className="input-box">
                    <textarea rows="6" cols="10" placeholder="Enter content" 
                    value = {content} onChange={(e) => setContent(e.target.value)}
                    required></textarea>
                </div>

                <div className="input-box">
                    <input placeholder="Enter name" value={headname}
                    onChange={(e) => setHeadName(e.target.value)}
                    required></input>
                </div>

                <div className="input-box">
                    <input placeholder="Enter position" value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required></input>
                </div>

                <input type="file" accept=".pdf" onChange={(e) => selectTemplate(e)}></input>
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


                {file && (
                    <div className="download-sec">
                        <div className="input-box">
                            <input placeholder="Enter file name" value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            required></input>
                        </div>
                    
                        <div className="download-btn">
                            <button onClick={() => downloadPDF()}>
                                Download PDF
                            </button>
                        </div>
                    
                    </div>

                )}

                
            </div>
        </div>
    )
}

export default Main
