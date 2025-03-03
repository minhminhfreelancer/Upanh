import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { ExternalLink, Info, Key, Settings } from "lucide-react";

const CloudflareUploadGuide = () => {
  return (
    <Card className="w-full max-w-[800px] bg-white shadow-md">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Hướng dẫn Upload lên Cloudflare
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Bước 1: Tạo tài khoản Cloudflare
          </h3>
          <p className="text-gray-600 ml-7">
            Đăng ký tài khoản tại{" "}
            <a
              href="https://dash.cloudflare.com/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline inline-flex items-center gap-1"
            >
              Cloudflare Dashboard
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-500" />
            Bước 2: Lấy API Token và Account ID
          </h3>
          <ol className="list-decimal ml-10 space-y-2 text-gray-600">
            <li>
              Đăng nhập vào{" "}
              <a
                href="https://dash.cloudflare.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center gap-1"
              >
                Cloudflare Dashboard
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>Chọn tài khoản của bạn từ danh sách</li>
            <li>
              Tìm Account ID ở góc dưới bên phải của trang dashboard (dạng:
              123456789abcdef)
            </li>
            <li>
              Tạo API Token bằng cách vào{" "}
              <span className="font-medium">User Profile</span> &gt;{" "}
              <span className="font-medium">API Tokens</span> &gt;{" "}
              <span className="font-medium">Create Token</span>
            </li>
            <li>
              Chọn "Create Custom Token" và đảm bảo token có quyền truy cập vào
              Cloudflare Images (Account.Cloudflare Images: Edit)
            </li>
          </ol>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            Bước 3: Cấu hình ứng dụng
          </h3>
          <ol className="list-decimal ml-10 space-y-2 text-gray-600">
            <li>
              Tạo file{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code>{" "}
              trong thư mục gốc của dự án
            </li>
            <li>
              Thêm các biến môi trường sau:
              <pre className="bg-gray-100 p-3 rounded-md mt-2 overflow-x-auto">
                <code>
                  VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
                  <br />
                  VITE_CLOUDFLARE_API_TOKEN=your_api_token_here
                </code>
              </pre>
            </li>
            <li>Khởi động lại ứng dụng để áp dụng các thay đổi</li>
          </ol>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Bước 4: Sử dụng ứng dụng để upload
          </h3>
          <ol className="list-decimal ml-10 space-y-2 text-gray-600">
            <li>Nhấn vào nút "Upload Image" ở thanh điều hướng</li>
            <li>
              Kéo và thả hình ảnh vào khu vực upload hoặc nhấn "Browse Files"
            </li>
            <li>Nhấn "Upload to Cloudflare" để bắt đầu quá trình upload</li>
            <li>Theo dõi tiến trình upload và đợi thông báo thành công</li>
          </ol>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-4">
          <p className="text-blue-700 flex items-start gap-2">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>
              Lưu ý: Cloudflare Images là dịch vụ trả phí, nhưng có gói miễn phí
              với giới hạn lưu trữ. Kiểm tra{" "}
              <a
                href="https://www.cloudflare.com/products/cloudflare-images/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                trang sản phẩm
                <ExternalLink className="h-3 w-3" />
              </a>{" "}
              để biết thêm chi tiết về giá cả và giới hạn.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CloudflareUploadGuide;
