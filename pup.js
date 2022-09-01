const puppeteer = require('puppeteer-core');
const {Command} = require('commander');
const program = new Command();

program
    .argument('<input-path>', 'Path for the HTML file')
    .argument('<output-path>', 'Path for the PDF file to be saved')
    .option('--page-size <type>', "Page size, normal print paper sizes", 'letter')
    .option('--margin <value>', "The margin used when generating a PDF e.g. '0.5in'", 0)
    .option('--margin-top <value>', "The top margin used when generating a PDF e.g. '0.5in'", 0)
    .option('--margin-left <value>', "The left margin used when generating a PDF e.g. '0.5in'", 0)
    .option('--margin-right <value>', "The right margin used when generating a PDF e.g. '0.5in'", 0)
    .option('--margin-bottom <value>', "The bottom margin used when generating a PDF e.g. '0.5in'", 0)
    .option('--height <type>', 'Height of browser window viewport', '1024')
    .option('--width  <type>', 'Width of browser window viewport', '768')
    .option('--print-background <type>', 'Whether the background should be in the pdf', true)
    .option('--emulate-type <type>', "The type of CSS media type of the page. 'screen', 'print', 'null'", false)
    .allowUnknownOption()

program.parse(process.argv);

const flags = program.opts();
const [inputPath, outputPath] = program.processedArgs;

(async () => {
    try {
        const input = inputPath;
        const output = outputPath;

        const browser = await puppeteer.launch({
            defaultViewport: {
                width: parseFloat(flags.width),
                height: parseFloat(flags.height),
            },
            executablePath: 'google-chrome-stable',
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        const file = `file://${input}`;

        if ( flags.emulateType !== false ) {
            await page.emulateMediaType(flags.emulateType);
        }

        await page.goto(file);
        
        await page.pdf({
            format: flags.pageSize,
            path: output,
            printBackground: flags.printBackground,
            width: parseFloat(flags.width),
            height: parseFloat(flags.height),
            margin: {
                top: flags.marginTop || flags.margin,
                left: flags.marginLeft || flags.margin,
                right: flags.marginRight || flags.margin,
                bottom: flags.marginBottom || flags.margin,
            },
        });

        await browser.close();
    } catch ( e ) {
        console.log(e);
    }
})();