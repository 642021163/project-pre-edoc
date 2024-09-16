function Validation(values) {
    let errors = {};

    // ตรวจสอบชื่อ-สกุล
    if (!values.full_name.trim()) {
        errors.full_name = "กรุณากรอก ชื่อ-สกุล";
    }

    // ตรวจสอบเรื่อง
    if (!values.subject.trim()) {
        errors.subject = "กรุณากรอก ชื่อเรื่อง";
    }

    // ตรวจสอบจาก
    if (!values.from_sender.trim()) {
        errors.from_sender = "กรุณากรอก สังกัด";
    }

    // ตรวจสอบถึง
    if (!values.to_recipient.trim()) {
        errors.to_recipient = "กรุณากรอกข้อมูลให้ครบถ้วน";
    }

    // ตรวจสอบไฟล์
    if (!values.file_url) {
        errors.file_url = "กรุณาเลือกไฟล์";
    }

    return errors;
}

export default Validation;
