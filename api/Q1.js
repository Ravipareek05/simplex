export default function handler(req, res) {
    const { q, search, path } = req.query;

    const commands = {
        "1": "md5sum image.dd > image.md5",
        "2": "img_stat image.dd",
        "3": "mmstat image.dd",
        "4": "mmls image.dd (to see offset)",
        "5": "fsstat -o <offset> image1.dd",
        "6": "fls -o <offset> image1.dd (* are deleted)",
        "7": "fls -d -o <offset> image1.dd",
        "8": "icat -o <offset> image1.dd <inode> > hello.txt",
        "9": "tsk_recover -iraw -o <offset> image1.dd <out_dir>",
        "10": "sudo scalpel -o out2 image1.dd",
        "11": "sudo bulk_extractor -o out2 image1.dd",
        "12": "sudo magicrescue -r <recipe> -d out3 -M 0 image1.dd",
        // Forensic grep from top of image.png
        "fgrep": `strings -td image.dd | grep -i "${search || 'search-term'}"`,
        // Folder/Recursive search (requested)
        "rgrep": `grep -rnE "${search || 'pattern'}" ${path || '.'}`
    };

    if (!q) {
        return res.status(200).send("Usage: curl [url]?q=rgrep&search=term&path=/path/to/folder");
    }

    const result = commands[q];
    res.status(200).send(result ? `>> ${result}\n` : "Command not found.\n");
}
