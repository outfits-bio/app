export function ThemeCard() {
    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <div className="flex flex-col items-start flex gap-5 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Themes</h1>
                    <p>Do you prefer a lighter or dark theme?</p>
                </div>

                <div className="flex gap-4 max-w-full overflow-auto">
                    <div className="flex flex-col items-start gap-3 p-4 border rounded-lg active:bg-gray-100">
                        <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1365_6)"><rect width="160" height="100" rx="4" fill="white" /><rect x="65" y="9" width="28" height="7" rx="3.5" fill="#EEEEEE" /><rect x="65.5" y="18.5" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><rect x="81.5" y="18.5" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><rect x="65" y="49.4286" width="39" height="7" rx="3.5" fill="#EEEEEE" /><rect x="65.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><rect x="81.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><rect x="97.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><rect x="113.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><rect x="129.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><rect x="65" y="89.8572" width="22" height="7" rx="3.5" fill="#EEEEEE" /><rect x="65.5" y="99.3572" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><rect x="81.5" y="99.3572" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><rect x="97.5" y="99.3572" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><circle cx="26" cy="24" r="14.5" stroke="#EEEEEE" /><rect x="11" y="41" width="30" height="5" rx="2.5" fill="#EEEEEE" /><rect x="11" y="48" width="41" height="5" rx="2.5" fill="#EEEEEE" /><rect x="11" y="55" width="13" height="5" rx="2.5" fill="#EEEEEE" /><rect x="26" y="55" width="13" height="5" rx="2.5" fill="#EEEEEE" /><rect x="11" y="64" width="30" height="10" rx="1.5" fill="#EEEEEE" /><rect x="43" y="64" width="10" height="10" rx="1.5" fill="#EEEEEE" /></g><rect x="0.5" y="0.5" width="159" height="99" rx="3.5" stroke="#EEEEEE" /><defs><clipPath id="clip0_1365_6"><rect width="160" height="100" rx="4" fill="white" /></clipPath></defs></svg>
                        Light Mode
                    </div>

                    <div className="flex flex-col items-start gap-3 p-4 border rounded-lg active:bg-gray-100">
                        <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1365_40)"><rect width="160" height="100" rx="4" fill="#171717" /><rect x="65" y="9" width="28" height="7" rx="3.5" fill="#2D2D2D" /><rect x="65.5" y="18.5" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="81.5" y="18.5" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="65" y="49.4286" width="39" height="7" rx="3.5" fill="#2D2D2D" /><rect x="65.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="81.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="97.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="113.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="129.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="65" y="89.8572" width="22" height="7" rx="3.5" fill="#2D2D2D" /><rect x="65.5" y="99.3572" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="81.5" y="99.3572" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="97.5" y="99.3572" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><circle cx="26" cy="24" r="14.5" stroke="#2D2D2D" /><rect x="11" y="41" width="30" height="5" rx="2.5" fill="#2D2D2D" /><rect x="11" y="48" width="41" height="5" rx="2.5" fill="#2D2D2D" /><rect x="11" y="55" width="13" height="5" rx="2.5" fill="#2D2D2D" /><rect x="26" y="55" width="13" height="5" rx="2.5" fill="#2D2D2D" /><rect x="11" y="64" width="30" height="10" rx="1.5" fill="#2D2D2D" /><rect x="43" y="64" width="10" height="10" rx="1.5" fill="#2D2D2D" /></g><rect x="0.5" y="0.5" width="159" height="99" rx="3.5" stroke="#EEEEEE" /><defs><clipPath id="clip0_1365_40"><rect width="160" height="100" rx="4" fill="white" /></clipPath></defs></svg>
                        Dark Mode
                    </div>

                    <div className="flex flex-col items-start gap-3 p-4 border rounded-lg active:bg-gray-100">
                        <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1365_74)"><g clip-path="url(#clip1_1365_74)"><rect width="160" height="100" fill="black" /><rect x="65" y="9" width="28" height="7" rx="3.5" fill="#2D2D2D" /><rect x="65.5" y="18.5" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="81.5" y="18.5" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="65" y="49.4286" width="39" height="7" rx="3.5" fill="#2D2D2D" /><rect x="65.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="81.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="97.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="113.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="129.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="65" y="89.8572" width="22" height="7" rx="3.5" fill="#2D2D2D" /><rect x="65.5" y="99.3572" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="81.5" y="99.3572" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><rect x="97.5" y="99.3572" width="11" height="20.4286" rx="1.5" stroke="#2D2D2D" /><circle cx="26" cy="24" r="14.5" stroke="#2D2D2D" /><rect x="11" y="41" width="30" height="5" rx="2.5" fill="#2D2D2D" /><rect x="11" y="48" width="41" height="5" rx="2.5" fill="#2D2D2D" /><rect x="11" y="55" width="13" height="5" rx="2.5" fill="#2D2D2D" /><rect x="26" y="55" width="13" height="5" rx="2.5" fill="#2D2D2D" /><rect x="11" y="64" width="30" height="10" rx="1.5" fill="#2D2D2D" /><rect x="43" y="64" width="10" height="10" rx="1.5" fill="#2D2D2D" /></g><g clip-path="url(#clip2_1365_74)"><rect width="80" height="100" fill="white" /><rect x="65" y="9" width="28" height="7" rx="3.5" fill="#EEEEEE" /><rect x="65.5" y="18.5" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><rect x="65" y="49.4286" width="39" height="7" rx="3.5" fill="#EEEEEE" /><rect x="65.5" y="58.9286" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><rect x="65" y="89.8572" width="22" height="7" rx="3.5" fill="#EEEEEE" /><rect x="65.5" y="99.3572" width="11" height="20.4286" rx="1.5" stroke="#EEEEEE" /><circle cx="26" cy="24" r="14.5" stroke="#EEEEEE" /><rect x="11" y="41" width="30" height="5" rx="2.5" fill="#EEEEEE" /><rect x="11" y="48" width="41" height="5" rx="2.5" fill="#EEEEEE" /><rect x="11" y="55" width="13" height="5" rx="2.5" fill="#EEEEEE" /><rect x="26" y="55" width="13" height="5" rx="2.5" fill="#EEEEEE" /><rect x="11" y="64" width="30" height="10" rx="1.5" fill="#EEEEEE" /><rect x="43" y="64" width="10" height="10" rx="1.5" fill="#EEEEEE" /></g></g><rect x="0.5" y="0.5" width="159" height="99" rx="3.5" stroke="#EEEEEE" /><defs><clipPath id="clip0_1365_74"><rect width="160" height="100" rx="4" fill="white" /></clipPath><clipPath id="clip1_1365_74"><rect width="160" height="100" fill="white" /></clipPath><clipPath id="clip2_1365_74"><rect width="80" height="100" fill="white" /></clipPath></defs></svg>
                        System Automatic
                    </div>
                </div>

            </div>
        </div>
    )
}

