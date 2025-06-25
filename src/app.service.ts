import { Injectable, OnModuleInit } from '@nestjs/common';
import noble from '@abandonware/noble';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    noble.on('stateChange', async (state) => {
      console.log('BLE 상태:', state);
      if (state === 'poweredOn') {
        // duplicates: true → 연속 측정값 수신 가능
        noble.startScanning([], true);
      } else {
        noble.stopScanning();
      }
    });

    noble.on('discover', async (peripheral) => {
      const deviceName = peripheral.advertisement.localName || '';

      if (deviceName === 'CT2380016946') {
        console.log(`📡 LS-238 기기 발견됨: ${deviceName}`);
        noble.stopScanning();

        try {
          await peripheral.connectAsync();
          console.log('✅ BLE 연결 성공');

          const { characteristics } = await peripheral.discoverSomeServicesAndCharacteristicsAsync([], []);

          for (const char of characteristics) {
            if (char.properties.includes('notify')) {
              await char.subscribeAsync();

              char.on('data', (data) => {
                const rawHex = data.toString('hex');
                console.log('🔸 원시 데이터:', rawHex);

                const parsed = this.parseThicknessData(data);
                console.log('📏 측정값 (μm):', parsed);
              });
            }
          }
        } catch (err) {
          console.error('❌ 연결 중 오류:', err);
        }
      }
    });
  }

  /**
   * LS-238 측정값 파싱 (μm)
   * 
   */
  private parseThicknessData(buffer: Buffer): number | null {
    try {
      if (buffer.length >= 12) {
        const raw = buffer.readUInt16LE(8); // ✅ 바르게 이동
        console.log(`raw: ${raw}, parsed: ${raw / 10}`);
        console.log(`data length: ${buffer.length}, hex: ${buffer.toString('hex')}`);
        return raw / 10;
      }
      return null;
    } catch (e) {
      console.error('❌ 파싱 오류:', e);
      return null;
    }
  }
  
  
  
}
