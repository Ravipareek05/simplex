export default function handler(req, res) {
    // This is a plain text block formatted like a MATLAB help screen
    const toolbox = `
============================================================
                 FORENSIC COMMAND TOOLBOX
============================================================

--- Interactive Data Recovery ---
[testdisk] sudo testdisk image.dd (Create log > Analyze > Quick search)

--- Integrity & Partition Layout ---
[1] md5sum image.dd > image.md5
[2] img_stat image.dd
[3] mmstat image.dd
[4] mmls image.dd (to see offset)

--- File System Analysis ---
[5] fsstat -o <offset> image1.dd
[6] fls -o <offset> image1.dd (* are deleted)
[7] fls -d -o <offset> image1.dd

--- Extraction & Recovery ---
[8] icat -o <offset> image1.dd <inode> > hello.txt
[9] tsk_recover -iraw -o <offset> image1.dd <out_dir>

--- File Carving ---
[10] sudo scalpel -o out2 image1.dd
[11] sudo bulk_extractor -o out2 image1.dd
[12] sudo magicrescue -r <recipe> -d out3 -M 0 image1.dd

--- Searching (Grep) ---
[Forensic] strings -td image.dd | grep -i "search-term"
[Folder]   grep -rnE "pattern" /path/to/folder

============================================================
`;

    // Send the text directly to the terminal
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(toolbox);
}
