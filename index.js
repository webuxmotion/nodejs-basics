const http = require('http')
const path = require('path')
const fs = require('fs')

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit. Aenean velit erat, vehicula eget lacinia ut, dignissim non tellus. Aliquam nec lacus mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis. Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem. Fusce a turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris at ante tellus. Vestibulum a metus lectus. Praesent tempor purus a lacus blandit eget gravida ante hendrerit. Cras et eros metus. Sed commodo malesuada eros, vitae interdum augue semper quis. Fusce id magna nunc. Curabitur sollicitudin placerat semper. Cras et mi neque, a dignissim risus. Nulla venenatis porta lacus, vel rhoncus lectus tempor vitae. Duis sagittis venenatis rutrum. Curabitur tempor massa';

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        })

        if (req.url === '/') {
            res.writeHead(200, {
                'Content-Type': 'application/pdf'
            })

            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument;

            //doc.pipe(fs.createWriteStream('file.pdf')); // write to PDF
            doc.pipe(res);                                       // HTTP response

            doc
                .text('And here is some wrapped text...', 50, 300)
                .font('Courier', 13)
                .font('Helvetica', 13)
                .moveDown()
                .text(lorem, {
                    width: 512,
                    align: 'left',
                    indent: 50,
                    columns: 2,
                    height: 300,
                    ellipsis: true
                });

            doc.image('test.png', 50, 15, {width: 100})
                .text('Proportional to width', 0, 0);
            // add stuff to PDF here using methods described below...

            // finalize the PDF and end the stream
            doc.end();
/*
            fs.readFile(
                path.join(__dirname, 'views/index.html'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        throw err
                    }
                    
                    res.end(content)
                }
            )*/
        } else if (req.url === '/about') {
            fs.readFile(
                path.join(__dirname, 'views/about.html'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        throw err
                    }
                    
                    res.end(content)
                }
            )
        } else if (req.url === '/api/users') {
            res.writeHead(200, {
                'Content-Type': 'text/json'
            })

            const years = [
                {name: 'Andrii', age: 29},
                {name: 'Ann', age: 27}
            ]

            res.end(JSON.stringify(years))
        }
    } else if (req.method === 'POST') {
        const body = []
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        })

        req.on('data', data => {
            body.push(Buffer.from(data))
        })

        req.on('end', () => {
            console.log(body.toString());
            const message = body.toString().split('=')[1];

            res.end(`
                <h1>Наше сообщение: ${message}</h1>
            `)
        })

        
    }
})

server.listen(3000, () => {
    console.log('Server is running...')
})